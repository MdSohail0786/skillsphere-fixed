const crypto = require('crypto');
const Transaction = require('../models/Transaction');
const Project = require('../models/Project');
const FreelancerProfile = require('../models/FreelancerProfile');
const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');

const PLATFORM_FEE = 10;

const createOrder = asyncHandler(async (req, res) => {
  const Razorpay = require('razorpay');
  const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
  const { projectId, milestoneId, amount } = req.body;
  const project = await Project.findById(projectId);
  if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
  if (project.client.toString() !== req.user._id.toString()) return res.status(403).json({ success: false, message: 'Unauthorized' });
  const amountInPaise = Math.round(Number(amount) * 100);
  const receipt = `rcpt_${Date.now()}`;
  const order = await razorpay.orders.create({ amount: amountInPaise, currency: 'INR', receipt, notes: { projectId, milestoneId: milestoneId || '' } });
  const platformFee = (Number(amount) * PLATFORM_FEE) / 100;
  const transaction = await Transaction.create({
    project: projectId, milestoneId: milestoneId || undefined,
    client: req.user._id, freelancer: project.freelancer,
    amount: Number(amount), platformFee, netAmount: Number(amount) - platformFee,
    currency: 'INR', type: 'payment', status: 'pending',
    razorpayOrderId: order.id, receipt,
    description: milestoneId ? 'Milestone payment' : 'Project payment',
  });
  res.json({ success: true, message: 'Order created', data: { orderId: order.id, amount: order.amount, currency: order.currency, key: process.env.RAZORPAY_KEY_ID, transactionId: transaction._id } });
});

const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, transactionId } = req.body;
  const expectedSig = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest('hex');
  if (expectedSig !== razorpay_signature) return res.status(400).json({ success: false, message: 'Payment verification failed' });
  const transaction = await Transaction.findByIdAndUpdate(transactionId, { status: 'completed', razorpayPaymentId: razorpay_payment_id, razorpaySignature: razorpay_signature }, { new: true });
  if (transaction.milestoneId) {
    const project = await Project.findById(transaction.project);
    const milestone = project?.milestones.id(transaction.milestoneId);
    if (milestone) { milestone.status = 'paid'; milestone.paidAt = new Date(); project.paidAmount = (project.paidAmount || 0) + transaction.amount; await project.save(); }
    await FreelancerProfile.findOneAndUpdate({ user: transaction.freelancer }, { $inc: { totalEarnings: transaction.netAmount } });
    await Notification.create({ recipient: transaction.freelancer, sender: req.user._id, type: 'payment_released', title: 'Payment Released! 💰', body: `You received ₹${transaction.netAmount.toFixed(0)}`, data: { transactionId: transaction._id } });
  }
  res.json({ success: true, message: 'Payment verified', data: transaction });
});

const getTransactions = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const query = req.user.role === 'client' ? { client: req.user._id } : { freelancer: req.user._id };
  const skip = (Number(page) - 1) * Number(limit);
  const [transactions, total] = await Promise.all([Transaction.find(query).populate('project', 'title').sort('-createdAt').skip(skip).limit(Number(limit)), Transaction.countDocuments(query)]);
  res.json({ success: true, message: 'Transactions', data: transactions, pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) } });
});

const getTransactionById = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id).populate('client', 'name email').populate('freelancer', 'name email').populate('project', 'title');
  if (!transaction) return res.status(404).json({ success: false, message: 'Transaction not found' });
  const isParty = [transaction.client._id, transaction.freelancer._id].some(id => id.toString() === req.user._id.toString());
  if (!isParty && req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'Access denied' });
  res.json({ success: true, message: 'Transaction', data: transaction });
});

module.exports = { createOrder, verifyPayment, getTransactions, getTransactionById };
