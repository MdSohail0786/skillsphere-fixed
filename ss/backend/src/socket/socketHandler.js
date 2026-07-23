const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { Message, Conversation } = require('../models/Message');
const Notification = require('../models/Notification');

const connectedUsers = new Map();

const socketHandler = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];
      if (!token) return next(new Error('Authentication required'));
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      const user = await User.findById(decoded.userId);
      if (!user) return next(new Error('User not found'));
      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', async (socket) => {
    const userId = socket.user._id.toString();
    connectedUsers.set(userId, socket.id);
    await User.findByIdAndUpdate(userId, { isOnline: true, lastSeen: new Date() });
    socket.broadcast.emit('user:online', { userId });
    socket.join(`user:${userId}`);

    socket.on('conversation:join', (conversationId) => socket.join(`conversation:${conversationId}`));
    socket.on('conversation:leave', (conversationId) => socket.leave(`conversation:${conversationId}`));

    socket.on('typing:start', ({ conversationId }) => socket.to(`conversation:${conversationId}`).emit('typing:start', { userId, userName: socket.user.name }));
    socket.on('typing:stop', ({ conversationId }) => socket.to(`conversation:${conversationId}`).emit('typing:stop', { userId }));

    socket.on('message:send', async ({ conversationId, content, type = 'text' }) => {
      try {
        const conversation = await Conversation.findById(conversationId);
        if (!conversation || !conversation.participants.some(p => p.toString() === userId)) return;
        const message = await Message.create({ conversation: conversationId, sender: socket.user._id, content, type });
        await message.populate('sender', 'name avatar');
        await Conversation.findByIdAndUpdate(conversationId, { lastMessage: message._id, lastMessageAt: new Date() });
        io.to(`conversation:${conversationId}`).emit('message:new', message);
        const others = conversation.participants.filter(p => p.toString() !== userId);
        for (const pId of others) {
          const pIdStr = pId.toString();
          if (!connectedUsers.has(pIdStr)) {
            await Notification.create({ recipient: pId, sender: socket.user._id, type: 'new_message', title: `New message from ${socket.user.name}`, body: content.substring(0, 100), link: `/chat/${conversationId}` });
          } else {
            io.to(`user:${pIdStr}`).emit('notification:new', { type: 'new_message', title: `New message from ${socket.user.name}`, body: content.substring(0, 100) });
          }
        }
      } catch (err) {
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    socket.on('message:read', async ({ conversationId }) => {
      await Message.updateMany({ conversation: conversationId, sender: { $ne: socket.user._id }, isRead: false }, { isRead: true, readAt: new Date() });
      socket.to(`conversation:${conversationId}`).emit('message:read', { conversationId, userId });
    });

    socket.on('disconnect', async () => {
      connectedUsers.delete(userId);
      await User.findByIdAndUpdate(userId, { isOnline: false, lastSeen: new Date() });
      socket.broadcast.emit('user:offline', { userId });
    });
  });

  return { connectedUsers };
};

module.exports = socketHandler;
