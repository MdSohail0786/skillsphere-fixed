const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { submitProposal, getMyProposals, getProposalById, acceptProposal, rejectProposal, withdrawProposal } = require('../controllers/proposalController');

router.post('/', authenticate, authorize('freelancer'), submitProposal);
router.get('/my-proposals', authenticate, authorize('freelancer'), getMyProposals);
router.get('/:id', authenticate, getProposalById);
router.patch('/:id/accept', authenticate, authorize('client', 'admin'), acceptProposal);
router.patch('/:id/reject', authenticate, authorize('client', 'admin'), rejectProposal);
router.delete('/:id', authenticate, authorize('freelancer'), withdrawProposal);

module.exports = router;
