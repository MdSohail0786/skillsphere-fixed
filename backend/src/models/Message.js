const mongoose = require('mongoose');
const conversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
  lastMessageAt: Date,
  unreadCounts: { type: Map, of: Number, default: {} },
}, { timestamps: true });
conversationSchema.index({ participants: 1 });

const messageSchema = new mongoose.Schema({
  conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, maxlength: 5000, default: '' },
  type: { type: String, enum: ['text', 'file', 'image', 'system'], default: 'text' },
  fileUrl: String,
  fileName: String,
  isRead: { type: Boolean, default: false },
  readAt: Date,
}, { timestamps: true });
messageSchema.index({ conversation: 1, createdAt: 1 });

const Conversation = mongoose.model('Conversation', conversationSchema);
const Message = mongoose.model('Message', messageSchema);
module.exports = { Conversation, Message };
