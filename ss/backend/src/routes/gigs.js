const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { uploadMultiple } = require('../config/cloudinary');
const { getAllGigs, getGigById, getMyGigs, createGig, updateGig, deleteGig, toggleGigStatus } = require('../controllers/gigController');

router.get('/', getAllGigs);
router.get('/my-gigs', authenticate, authorize('freelancer'), getMyGigs);
router.get('/:id', getGigById);
router.post('/', authenticate, authorize('freelancer'), uploadMultiple('gigs', 'images', 5), createGig);
router.put('/:id', authenticate, authorize('freelancer'), updateGig);
router.delete('/:id', authenticate, authorize('freelancer'), deleteGig);
router.patch('/:id/toggle', authenticate, authorize('freelancer'), toggleGigStatus);

module.exports = router;
