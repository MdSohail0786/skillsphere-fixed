const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { uploadSingle } = require('../config/cloudinary');
const { getConversations, getMessages, createOrGetConversation, sendMessage } = require('../controllers/chatController');

router.get('/conversations', authenticate, getConversations);
router.post('/conversations', authenticate, createOrGetConversation);
router.get('/conversations/:id/messages', authenticate, getMessages);
router.post('/conversations/:id/messages', authenticate, uploadSingle('chat-files', 'file'), sendMessage);

module.exports = router;
