const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { uploadSingle } = require('../config/cloudinary');
const { getUserProfile, updateProfile, updateAvatar, updateCoverImage, changePassword, searchUsers, getNearbyUsers } = require('../controllers/userController');

router.get('/search', searchUsers);
router.get('/nearby', getNearbyUsers);
router.get('/profile/:id', getUserProfile);
router.put('/profile', authenticate, updateProfile);
router.put('/avatar', authenticate, uploadSingle('avatars', 'avatar'), updateAvatar);
router.put('/cover-image', authenticate, uploadSingle('covers', 'coverImage'), updateCoverImage);
router.put('/change-password', authenticate, changePassword);

module.exports = router;
