const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reviewee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, maxlength: 2000 },
  type: { type: String, enum: ['client-to-freelancer', 'freelancer-to-client'], required: true },
  response: String,
  isPublic: { type: Boolean, default: true },
}, { timestamps: true });
reviewSchema.index({ reviewee: 1 });
reviewSchema.index({ project: 1 });
module.exports = mongoose.model('Review', reviewSchema);
