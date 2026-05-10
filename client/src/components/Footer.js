import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { FiInstagram, FiFacebook } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import './Footer.css';

export default function Footer() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    api.get('/settings').then(r => setSettings(r.data.data)).catch(() => {});
  }, []);

  const wa = settings?.whatsappNumber?.replace(/\D/g, '');

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <div className="brand-logo">🎨 Laki <span className="gold-text">Arts</span></div>
          <p>{settings?.artistBio || 'Original artworks crafted with passion.'}</p>
          <div className="footer-socials">
            {wa && (
              <a href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer" title="WhatsApp">
                <FaWhatsapp size={20}/>
              </a>
            )}
            {settings?.socialLinks?.instagram && (
              <a href={settings.socialLinks.instagram} target="_blank" rel="noreferrer" title="Instagram">
                <FiInstagram size={20}/>
              </a>
            )}
            {settings?.socialLinks?.facebook && (
              <a href={settings.socialLinks.facebook} target="_blank" rel="noreferrer" title="Facebook">
                <FiFacebook size={20}/>
              </a>
            )}
          </div>
        </div>

        <div className="footer-links">
          <h4>Explore</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/gallery">Gallery</Link></li>
            <li><Link to="/about">About</Link></li>
          </ul>
        </div>

        <div className="footer-links">
          <h4>Account</h4>
          <ul>
            <li><Link to="/login">Sign In</Link></li>
            <li><Link to="/register">Register</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Laki Arts. All rights reserved. Crafted with ❤️</p>
      </div>
    </footer>
  );
}
