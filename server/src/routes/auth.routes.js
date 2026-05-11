const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const { generateToken, protect, adminOnly } = require('../middleware/auth.middleware');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ success: false, message: 'Please fill all fields' });

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ success: false, message: 'Email already registered' });

  const user = await User.create({ name, email, password, role: 'customer' });
  res.status(201).json({
    success: true,
    data: { _id: user._id, name: user.name, email: user.email, role: user.role },
    token: generateToken(user._id),
  });
});

// @POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password)))
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  if (user.isBanned) return res.status(403).json({ success: false, message: 'Account is banned' });

  res.json({
    success: true,
    data: { _id: user._id, name: user.name, email: user.email, role: user.role },
    token: generateToken(user._id),
  });
});

// @POST /api/auth/admin/login
router.post('/admin/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, role: 'admin' });
  if (!user || !(await user.matchPassword(password)))
    return res.status(401).json({ success: false, message: 'Invalid admin credentials' });

  res.json({
    success: true,
    data: { _id: user._id, name: user.name, email: user.email, role: user.role },
    token: generateToken(user._id),
  });
});

// @GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  res.json({ success: true, data: req.user });
});

// @POST /api/auth/google
router.post('/google', async (req, res) => {
  const { credential } = req.body;
  if (!credential) return res.status(400).json({ success: false, message: 'No credential provided' });

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { email, name, picture, sub } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (user) {
      if (user.isBanned) return res.status(403).json({ success: false, message: 'Account is banned' });
      if (!user.googleId) {
        user.googleId = sub;
        if (picture && !user.avatar) user.avatar = picture;
        await user.save();
      }
    } else {
      user = await User.create({
        name, email, googleId: sub, avatar: picture, role: 'customer'
      });
    }

    res.json({
      success: true,
      data: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error(error);
    res.status(401).json({ success: false, message: 'Google auth failed' });
  }
});

// @POST /api/auth/admin/google
router.post('/admin/google', async (req, res) => {
  const { credential } = req.body;
  if (!credential) return res.status(400).json({ success: false, message: 'No credential provided' });

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { email, sub } = ticket.getPayload();

    const user = await User.findOne({ email, role: 'admin' });
    if (!user) return res.status(401).json({ success: false, message: 'Unauthorized admin' });

    if (!user.googleId) {
      user.googleId = sub;
      await user.save();
    }

    res.json({
      success: true,
      data: { _id: user._id, name: user.name, email: user.email, role: user.role },
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error(error);
    res.status(401).json({ success: false, message: 'Google auth failed' });
  }
});

// @GET /api/auth/admins
router.get('/admins', protect, adminOnly, async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' }).select('-password');
    res.json({ success: true, data: admins });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @POST /api/auth/admin/register
router.post('/admin/register', protect, adminOnly, async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ success: false, message: 'Please fill all fields' });

  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: 'Email already registered' });

    const user = await User.create({ name, email, password, role: 'admin' });
    res.status(201).json({
      success: true,
      data: { _id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @DELETE /api/auth/admins/:id
router.delete('/admins/:id', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'Admin not found' });
    if (user.role !== 'admin') return res.status(400).json({ success: false, message: 'User is not an admin' });
    
    // Prevent self-deletion
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot delete yourself' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Admin removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;

