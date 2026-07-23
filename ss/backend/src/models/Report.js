const mongoose = require('mongoose');
const reportSchema = new mongoose.Schema({
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reportedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reportedGig: { type: mongoose.Schema.Types.ObjectId, ref: 'Gig' },
  reportedJob: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  reason: { type: String, required: true, maxlength: 2000 },
  category: { type: String, enum: ['spam', 'fraud', 'inappropriate', 'fake', 'harassment', 'other'], required: true },
  status: { type: String, enum: ['pending', 'reviewed', 'resolved', 'dismissed'], default: 'pending' },
  adminNote: String,
  resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  resolvedAt: Date,
}, { timestamps: true });
module.exports = mongoose.model('Report', reportSchema);
