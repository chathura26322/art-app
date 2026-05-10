const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const { protect, adminOnly } = require('../middleware/auth.middleware');

// @GET /api/customers — admin only
router.get('/', protect, adminOnly, async (req, res) => {
  const customers = await User.find({ role: 'customer' }).select('-password').sort('-createdAt');
  res.json({ success: true, data: customers });
});

// @PUT /api/customers/:id/ban — admin only
router.put('/:id/ban', protect, adminOnly, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user || user.role === 'admin')
    return res.status(404).json({ success: false, message: 'Customer not found' });
  user.isBanned = !user.isBanned;
  await user.save();
  res.json({ success: true, message: user.isBanned ? 'Customer banned' : 'Customer unbanned', data: user });
});

// @DELETE /api/customers/:id — admin only
router.delete('/:id', protect, adminOnly, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user || user.role === 'admin')
    return res.status(404).json({ success: false, message: 'Customer not found' });
  await user.deleteOne();
  res.json({ success: true, message: 'Customer deleted' });
});

module.exports = router;
