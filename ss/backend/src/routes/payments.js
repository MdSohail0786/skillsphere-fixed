const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { createOrder, verifyPayment, getTransactions, getTransactionById } = require('../controllers/paymentController');

router.post('/create-order', authenticate, authorize('client'), createOrder);
router.post('/verify', authenticate, verifyPayment);
router.get('/transactions', authenticate, getTransactions);
router.get('/transactions/:id', authenticate, getTransactionById);

module.exports = router;
