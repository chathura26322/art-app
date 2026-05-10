import React, { useEffect, useState } from 'react';
import api from '../services/api';
import './About.css';

export default function About() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    api.get('/settings').then(r => setSettings(r.data.data)).catch(() => {});
  }, []);

  const wa = settings?.whatsappNumber?.replace(/\D/g, '');

  return (
    <div className="about-page page-enter">
      <div className="about-hero">
        <div className="container">
          <p className="section-tag">✦ The Story</p>
          <h1 className="section-title">About <span className="gold-text">Laki Arts</span></h1>
        </div>
      </div>
      <div className="container about-body">
        <div className="about-grid">
          <div className="about-visual">
            <div className="artist-circle">🎨</div>
            <div className="artist-name-card">
              <h3>{settings?.artistName || 'Laki Arts'}</h3>
              <p>Original Artist</p>
            </div>
          </div>
          <div className="about-text">
            <h2>Passion in <span className="gold-text">Every Stroke</span></h2>
            <p>{settings?.artistBio || 'Welcome to Laki Arts — a space for original, handcrafted artworks made with heart and dedication.'}</p>
            <p>Every piece is a one-of-a-kind creation — no prints, no mass production. Just raw creativity translated onto canvas.</p>

            <div className="about-values">
              {[['🎨', 'Original', 'Every artwork is 100% handmade and unique'],
                ['❤️', 'Passionate', 'Created with genuine love for art'],
                ['✉️', 'Personal', 'Direct contact — no middlemen']].map(([icon, title, desc]) => (
                <div key={title} className="value-card">
                  <span>{icon}</span>
                  <div><h4>{title}</h4><p>{desc}</p></div>
                </div>
              ))}
            </div>

            {wa && (
              <a href={`https://wa.me/${wa}?text=Hi! I visited Laki Arts and would love to know more about your work.`}
                 target="_blank" rel="noreferrer" className="btn btn-whatsapp">
                💬 Get in Touch
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
