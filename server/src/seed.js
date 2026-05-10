require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User.model');
const Category = require('./models/Category.model');
const Settings = require('./models/Settings.model');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB for seeding...');

    // Seed admin user
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      await User.create({
        name: process.env.ADMIN_NAME || 'Laki',
        email: process.env.ADMIN_EMAIL || 'admin@lakiarts.com',
        password: process.env.ADMIN_PASSWORD || 'Admin@123',
        role: 'admin',
      });
      console.log('✅ Admin user created');
    } else {
      console.log('ℹ️  Admin already exists, skipping');
    }

    // Seed default categories
    const defaultCategories = [
      { name: 'Portraits', slug: 'portraits', description: 'Expressive portrait artworks' },
      { name: 'Landscapes', slug: 'landscapes', description: 'Beautiful landscape paintings' },
      { name: 'Abstract', slug: 'abstract', description: 'Modern abstract art' },
      { name: 'Illustrations', slug: 'illustrations', description: 'Hand-drawn illustrations' },
      { name: 'Mixed Media', slug: 'mixed-media', description: 'Creative mixed media artworks' },
    ];
    for (const cat of defaultCategories) {
      const exists = await Category.findOne({ slug: cat.slug });
      if (!exists) await Category.create(cat);
    }
    console.log('✅ Default categories seeded');

    // Seed default settings
    const settingsExists = await Settings.findOne();
    if (!settingsExists) {
      await Settings.create({
        artistName: 'Laki Arts',
        artistBio: 'Welcome to Laki Arts — where every brushstroke tells a story. I create original, handcrafted artworks with passion and love for beauty.',
        heroBannerText: 'Original Artworks, Crafted with Passion',
        heroSubText: 'Browse and own a unique piece of art — each one handcrafted with love.',
        whatsappNumber: '',
      });
      console.log('✅ Default settings created');
    } else {
      console.log('ℹ️  Settings already exist, skipping');
    }

    console.log('\n🎨 Seed complete! You can now start the server.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
};

seed();
