const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { createReview, getUserReviews, respondToReview } = require('../controllers/reviewController');

router.post('/', authenticate, createReview);
router.get('/user/:userId', getUserReviews);
router.post('/:id/respond', authenticate, respondToReview);

module.exports = router;
