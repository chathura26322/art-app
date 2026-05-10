const express = require('express');
const router = express.Router();
const Review = require('../models/Review.model');
const { protect, adminOnly } = require('../middleware/auth.middleware');

// @GET /api/reviews?artworkId=:id — public (approved only)
router.get('/', async (req, res) => {
  const { artworkId } = req.query;
  const query = artworkId ? { artwork: artworkId } : {};
  query.isApproved = true;
  const reviews = await Review.find(query)
    .populate('customer', 'name avatar')
    .populate('artwork', 'title')
    .sort('-createdAt');
  res.json({ success: true, data: reviews });
});

// @GET /api/reviews/all — admin only (all reviews)
router.get('/all', protect, adminOnly, async (req, res) => {
  const reviews = await Review.find()
    .populate('customer', 'name email avatar')
    .populate('artwork', 'title')
    .sort('-createdAt');
  res.json({ success: true, data: reviews });
});

// @POST /api/reviews — authenticated customers only
router.post('/', protect, async (req, res) => {
  if (req.user.role === 'admin')
    return res.status(403).json({ success: false, message: 'Admins cannot submit reviews' });

  const { artworkId, rating, comment } = req.body;
  if (!artworkId || !rating || !comment)
    return res.status(400).json({ success: false, message: 'Please fill all fields' });

  const existing = await Review.findOne({ artwork: artworkId, customer: req.user._id });
  if (existing) return res.status(400).json({ success: false, message: 'You already reviewed this artwork' });

  const review = await Review.create({
    artwork: artworkId,
    customer: req.user._id,
    rating,
    comment,
    isApproved: false,
  });
  res.status(201).json({ success: true, data: review, message: 'Review submitted and pending approval' });
});

// @PUT /api/reviews/:id/approve — admin only
router.put('/:id/approve', protect, adminOnly, async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
  review.isApproved = !review.isApproved;
  await review.save();
  res.json({ success: true, data: review, message: review.isApproved ? 'Review approved' : 'Review unapproved' });
});

// @DELETE /api/reviews/:id — admin only
router.delete('/:id', protect, adminOnly, async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
  await review.deleteOne();
  res.json({ success: true, message: 'Review deleted' });
});

module.exports = router;
