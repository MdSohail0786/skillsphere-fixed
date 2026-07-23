const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { uploadMultiple } = require('../config/cloudinary');
const { getAllFreelancers, getMyProfile, getFreelancerById, updateFreelancerProfile, addPortfolioItem, deletePortfolioItem, getFreelancerStats } = require('../controllers/freelancerController');

router.get('/', getAllFreelancers);
router.get('/profile/me', authenticate, authorize('freelancer'), getMyProfile);
router.get('/stats', authenticate, authorize('freelancer'), getFreelancerStats);
router.get('/:userId', getFreelancerById);
router.put('/profile', authenticate, authorize('freelancer'), updateFreelancerProfile);
router.post('/portfolio', authenticate, authorize('freelancer'), uploadMultiple('portfolio', 'images', 10), addPortfolioItem);
router.delete('/portfolio/:itemId', authenticate, authorize('freelancer'), deletePortfolioItem);

module.exports = router;
