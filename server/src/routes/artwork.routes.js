const express = require('express');
const router = express.Router();
const Artwork = require('../models/Artwork.model');
const Review = require('../models/Review.model');
const { protect, adminOnly } = require('../middleware/auth.middleware');
const { upload } = require('../config/cloudinary');

// @GET /api/artworks — public, with filter/pagination
router.get('/', async (req, res) => {
  const { category, available, featured, search, page = 1, limit = 12, sort = '-createdAt' } = req.query;
  const query = {};
  if (category) query.category = category;
  if (available !== undefined) query.isAvailable = available === 'true';
  if (featured === 'true') query.isFeatured = true;
  if (search) query.title = { $regex: search, $options: 'i' };

  const total = await Artwork.countDocuments(query);
  const artworks = await Artwork.find(query)
    .populate('category', 'name slug')
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({ success: true, total, page: Number(page), pages: Math.ceil(total / limit), data: artworks });
});

// @GET /api/artworks/:id — public, increment view count
router.get('/:id', async (req, res) => {
  const artwork = await Artwork.findByIdAndUpdate(
    req.params.id,
    { $inc: { views: 1 } },
    { new: true }
  ).populate('category', 'name slug');
  if (!artwork) return res.status(404).json({ success: false, message: 'Artwork not found' });
  res.json({ success: true, data: artwork });
});

// @POST /api/artworks — admin only, with image upload
router.post('/', protect, adminOnly, upload.array('images', 5), async (req, res) => {
  const { title, description, price, dimensions, medium, category, isAvailable, isFeatured, tags, currency } = req.body;
  const images = req.files ? req.files.map(f => f.path) : [];

  const artwork = await Artwork.create({
    title, description, price, dimensions, medium, category,
    isAvailable: isAvailable !== undefined ? isAvailable : true,
    isFeatured: isFeatured || false,
    images,
    tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : [],
    currency: currency || 'LKR',
  });
  res.status(201).json({ success: true, data: await artwork.populate('category', 'name slug') });
});

// @PUT /api/artworks/:id — admin only
router.put('/:id', protect, adminOnly, upload.array('images', 5), async (req, res) => {
  const artwork = await Artwork.findById(req.params.id);
  if (!artwork) return res.status(404).json({ success: false, message: 'Artwork not found' });

  const { title, description, price, dimensions, medium, category, isAvailable, isFeatured, tags, currency, keepImages } = req.body;
  const newImages = req.files ? req.files.map(f => f.path) : [];
  const existingImages = keepImages ? (Array.isArray(keepImages) ? keepImages : [keepImages]) : [];

  artwork.title = title || artwork.title;
  artwork.description = description || artwork.description;
  artwork.price = price !== undefined ? price : artwork.price;
  artwork.dimensions = dimensions || artwork.dimensions;
  artwork.medium = medium || artwork.medium;
  artwork.category = category || artwork.category;
  artwork.isAvailable = isAvailable !== undefined ? isAvailable === 'true' || isAvailable === true : artwork.isAvailable;
  artwork.isFeatured = isFeatured !== undefined ? isFeatured === 'true' || isFeatured === true : artwork.isFeatured;
  artwork.images = [...existingImages, ...newImages];
  artwork.currency = currency || artwork.currency;
  artwork.tags = tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : artwork.tags;

  await artwork.save();
  res.json({ success: true, data: await artwork.populate('category', 'name slug') });
});

// @DELETE /api/artworks/:id — admin only
router.delete('/:id', protect, adminOnly, async (req, res) => {
  const artwork = await Artwork.findById(req.params.id);
  if (!artwork) return res.status(404).json({ success: false, message: 'Artwork not found' });
  await Review.deleteMany({ artwork: artwork._id });
  await artwork.deleteOne();
  res.json({ success: true, message: 'Artwork deleted' });
});

module.exports = router;
