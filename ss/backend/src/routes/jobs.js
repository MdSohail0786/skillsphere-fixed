const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { getAllJobs, getJobById, getMyJobs, createJob, updateJob, deleteJob, getJobProposals } = require('../controllers/jobController');

router.get('/', getAllJobs);
router.get('/my-jobs', authenticate, authorize('client', 'admin'), getMyJobs);
router.get('/:id', getJobById);
router.get('/:id/proposals', authenticate, authorize('client', 'admin'), getJobProposals);
router.post('/', authenticate, authorize('client', 'admin'), createJob);
router.put('/:id', authenticate, authorize('client', 'admin'), updateJob);
router.delete('/:id', authenticate, authorize('client', 'admin'), deleteJob);

module.exports = router;
