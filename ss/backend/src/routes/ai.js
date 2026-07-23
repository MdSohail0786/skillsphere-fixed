const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { matchFreelancersForJob, getRecommendedJobs, getRecommendedGigs, getNearbyFreelancers } = require('../controllers/aiController');

router.get('/match-freelancers/:jobId', authenticate, matchFreelancersForJob);
router.get('/recommended-jobs', authenticate, getRecommendedJobs);
router.get('/recommended-gigs', getRecommendedGigs);
router.get('/nearby-freelancers', getNearbyFreelancers);

module.exports = router;
