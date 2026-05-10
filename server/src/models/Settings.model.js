const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  artistName: { type: String, default: 'Laki Arts' },
  artistBio: { type: String, default: 'Passionate artist creating unique, handcrafted artworks.' },
  whatsappNumber: { type: String, default: '' },
  heroBannerText: { type: String, default: 'Original Artworks, Crafted with Passion' },
  heroSubText: { type: String, default: 'Browse and own a unique piece of art — each one handcrafted with love.' },
  socialLinks: {
    instagram: { type: String, default: '' },
    facebook: { type: String, default: '' },
  },
  currency: { type: String, default: 'USD' },
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
