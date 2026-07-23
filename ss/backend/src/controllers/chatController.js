const { Conversation, Message } = require('../models/Message');
const asyncHandler = require('../utils/asyncHandler');

const getConversations = asyncHandler(async (req, res) => {
  const conversations = await Conversation.find({ participants: req.user._id }).populate('participants', 'name avatar isOnline lastSeen').populate('lastMessage').sort('-lastMessageAt');
  res.json({ success: true, message: 'Conversations', data: conversations });
});

const getMessages = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50 } = req.query;
  const conversation = await Conversation.findById(req.params.id);
  if (!conversation) return res.status(404).json({ success: false, message: 'Conversation not found' });
  if (!conversation.participants.some(p => p.toString() === req.user._id.toString())) return res.status(403).json({ success: false, message: 'Access denied' });
  const skip = (Number(page) - 1) * Number(limit);
  const messages = await Message.find({ conversation: req.params.id }).populate('sender', 'name avatar').sort('-createdAt').skip(skip).limit(Number(limit));
  await Message.updateMany({ conversation: req.params.id, sender: { $ne: req.user._id }, isRead: false }, { isRead: true, readAt: new Date() });
  res.json({ success: true, message: 'Messages', data: messages.reverse() });
});

const createOrGetConversation = asyncHandler(async (req, res) => {
  const { recipientId, projectId } = req.body;
  let conversation = await Conversation.findOne({ participants: { $all: [req.user._id, recipientId], $size: 2 } });
  if (!conversation) {
    conversation = await Conversation.create({ participants: [req.user._id, recipientId], ...(projectId ? { project: projectId } : {}) });
  }
  await conversation.populate('participants', 'name avatar isOnline lastSeen');
  res.json({ success: true, message: 'Conversation', data: conversation });
});

const sendMessage = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findById(req.params.id);
  if (!conversation) return res.status(404).json({ success: false, message: 'Conversation not found' });
  if (!conversation.participants.some(p => p.toString() === req.user._id.toString())) return res.status(403).json({ success: false, message: 'Access denied' });
  const message = await Message.create({
    conversation: req.params.id, sender: req.user._id,
    content: req.body.content || '',
    type: req.file ? (req.file.mimetype?.startsWith('image') ? 'image' : 'file') : 'text',
    fileUrl: req.file?.path, fileName: req.file?.originalname,
  });
  await Conversation.findByIdAndUpdate(req.params.id, { lastMessage: message._id, lastMessageAt: new Date() });
  await message.populate('sender', 'name avatar');
  res.status(201).json({ success: true, message: 'Message sent', data: message });
});

module.exports = { getConversations, getMessages, createOrGetConversation, sendMessage };
