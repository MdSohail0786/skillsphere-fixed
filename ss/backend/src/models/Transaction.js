const mongoose = require('mongoose');
const transactionSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  milestoneId: { type: mongoose.Schema.Types.ObjectId },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  platformFee: { type: Number, default: 0 },
  netAmount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  type: { type: String, enum: ['payment', 'refund', 'withdrawal'], required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  description: String,
  receipt: String,
}, { timestamps: true });
transactionSchema.index({ client: 1 });
transactionSchema.index({ freelancer: 1 });
transactionSchema.index({ status: 1 });
module.exports = mongoose.model('Transaction', transactionSchema);
