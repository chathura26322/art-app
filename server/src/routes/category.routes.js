const express = require('express');
const router = express.Router();
const Category = require('../models/Category.model');
const { protect, adminOnly } = require('../middleware/auth.middleware');

const toSlug = (name) => name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

// @GET /api/categories — public
router.get('/', async (req, res) => {
  const categories = await Category.find().sort('name');
  res.json({ success: true, data: categories });
});

// @POST /api/categories — admin only
router.post('/', protect, adminOnly, async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ success: false, message: 'Name is required' });
  const slug = toSlug(name);
  const exists = await Category.findOne({ slug });
  if (exists) return res.status(400).json({ success: false, message: 'Category already exists' });
  const category = await Category.create({ name, slug, description });
  res.status(201).json({ success: true, data: category });
});

// @PUT /api/categories/:id — admin only
router.put('/:id', protect, adminOnly, async (req, res) => {
  const { name, description } = req.body;
  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
  category.name = name || category.name;
  category.slug = name ? toSlug(name) : category.slug;
  category.description = description !== undefined ? description : category.description;
  await category.save();
  res.json({ success: true, data: category });
});

// @DELETE /api/categories/:id — admin only
router.delete('/:id', protect, adminOnly, async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
  await category.deleteOne();
  res.json({ success: true, message: 'Category deleted' });
});

module.exports = router;
