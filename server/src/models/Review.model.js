const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  artwork: { type: mongoose.Schema.Types.ObjectId, ref: 'Artwork', required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true, trim: true },
  isApproved: { type: Boolean, default: false },
}, { timestamps: true });

// One review per customer per artwork
reviewSchema.index({ artwork: 1, customer: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
