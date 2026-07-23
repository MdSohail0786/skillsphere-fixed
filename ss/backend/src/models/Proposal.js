const mongoose = require('mongoose');
const proposalSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  coverLetter: { type: String, required: true, maxlength: 5000 },
  bidAmount: { type: Number, required: true, min: 1 },
  bidType: { type: String, enum: ['fixed', 'hourly'], required: true },
  estimatedDays: { type: Number, required: true, min: 1 },
  attachments: [String],
  status: { type: String, enum: ['pending', 'accepted', 'rejected', 'withdrawn'], default: 'pending' },
  clientNote: String,
  milestones: [{ title: String, amount: Number, dueDate: Date, description: String }],
}, { timestamps: true });
proposalSchema.index({ job: 1, freelancer: 1 }, { unique: true });
proposalSchema.index({ freelancer: 1 });
module.exports = mongoose.model('Proposal', proposalSchema);
