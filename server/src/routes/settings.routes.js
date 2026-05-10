const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings.model');
const { protect, adminOnly } = require('../middleware/auth.middleware');

// @GET /api/settings — public
router.get('/', async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) settings = await Settings.create({});
  res.json({ success: true, data: settings });
});

// @PUT /api/settings — admin only
router.put('/', protect, adminOnly, async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) settings = new Settings();

  const { artistName, artistBio, whatsappNumber, heroBannerText, heroSubText, socialLinks, currency } = req.body;
  if (artistName !== undefined) settings.artistName = artistName;
  if (artistBio !== undefined) settings.artistBio = artistBio;
  if (whatsappNumber !== undefined) settings.whatsappNumber = whatsappNumber;
  if (heroBannerText !== undefined) settings.heroBannerText = heroBannerText;
  if (heroSubText !== undefined) settings.heroSubText = heroSubText;
  if (socialLinks !== undefined) settings.socialLinks = { ...settings.socialLinks, ...socialLinks };
  if (currency !== undefined) settings.currency = currency;

  await settings.save();
  res.json({ success: true, data: settings });
});

module.exports = router;
