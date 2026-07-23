const mongoose = require('mongoose');
const jobSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, maxlength: 200 },
  description: { type: String, required: true, maxlength: 8000 },
  category: { type: String, required: true },
  subcategory: String,
  skills: [String],
  budget: { type: { type: String, enum: ['fixed', 'hourly'], required: true }, min: { type: Number, required: true }, max: { type: Number, required: true }, currency: { type: String, default: 'INR' } },
  duration: { type: String, enum: ['less-than-1-month', '1-3-months', '3-6-months', 'more-than-6-months'] },
  experienceLevel: { type: String, enum: ['entry', 'intermediate', 'expert'], default: 'intermediate' },
  attachments: [String],
  status: { type: String, enum: ['open', 'in-progress', 'completed', 'closed', 'cancelled'], default: 'open' },
  location: { preference: { type: String, enum: ['remote', 'local', 'hybrid'], default: 'remote' }, city: String, state: String, country: String, pincode: String },
  proposals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Proposal' }],
  proposalCount: { type: Number, default: 0 },
  hiredFreelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  views: { type: Number, default: 0 },
  deadline: Date,
}, { timestamps: true });
jobSchema.index({ client: 1 });
jobSchema.index({ status: 1 });
jobSchema.index({ category: 1 });
jobSchema.index({ title: 'text', description: 'text', skills: 'text' });
module.exports = mongoose.model('Job', jobSchema);
