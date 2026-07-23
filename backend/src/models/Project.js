const mongoose = require('mongoose');
const milestoneSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  amount: { type: Number, required: true },
  dueDate: Date,
  status: { type: String, enum: ['pending', 'in-progress', 'submitted', 'approved', 'paid'], default: 'pending' },
  deliverables: [String],
  feedback: String,
  submittedAt: Date,
  approvedAt: Date,
  paidAt: Date,
});
const projectSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  proposal: { type: mongoose.Schema.Types.ObjectId, ref: 'Proposal' },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: String,
  totalAmount: { type: Number, required: true },
  paidAmount: { type: Number, default: 0 },
  currency: { type: String, default: 'INR' },
  status: { type: String, enum: ['active', 'on-hold', 'completed', 'disputed', 'cancelled'], default: 'active' },
  milestones: [milestoneSchema],
  startDate: { type: Date, default: Date.now },
  deadline: Date,
  files: [{ name: String, url: String, uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, uploadedAt: { type: Date, default: Date.now } }],
  progress: { type: Number, default: 0, min: 0, max: 100 },
  isClientReviewed: { type: Boolean, default: false },
  isFreelancerReviewed: { type: Boolean, default: false },
}, { timestamps: true });
projectSchema.index({ client: 1 });
projectSchema.index({ freelancer: 1 });
projectSchema.index({ status: 1 });
module.exports = mongoose.model('Project', projectSchema);
