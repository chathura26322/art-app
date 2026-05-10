import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ArtworkCard from '../components/ArtworkCard';
import './Home.css';

export default function Home() {
  const [settings, setSettings] = useState(null);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/settings'),
      api.get('/artworks?featured=true&limit=8'),
    ]).then(([s, a]) => {
      setSettings(s.data.data);
      setFeatured(a.data.data);
    }).finally(() => setLoading(false));
  }, []);

  const wa = settings?.whatsappNumber?.replace(/\D/g, '');

  return (
    <div className="home page-enter">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg-art" aria-hidden="true">
          {['🖼️','🎨','✏️','🖌️','🎭'].map((e,i) => (
            <span key={i} className="floating-icon" style={{ '--delay': `${i*1.2}s`, '--x': `${10+i*18}%` }}>{e}</span>
          ))}
        </div>
        <div className="container hero-content">
          <span className="hero-tag">✦ Handcrafted Original Art</span>
          <h1 className="hero-title">
            {settings?.heroBannerText || 'Original Artworks,'}
            <br /><span className="gold-text">Crafted with Passion</span>
          </h1>
          <p className="hero-sub">{settings?.heroSubText || 'Browse and own a unique piece of art — each one handcrafted with love.'}</p>
          <div className="hero-actions">
            <Link to="/gallery" className="btn btn-primary btn-lg">Explore Gallery</Link>
            {wa && (
              <a href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer" className="btn btn-outline btn-lg">
                Contact Artist
              </a>
            )}
          </div>
          <div className="hero-stats">
            <div className="stat"><span>{featured.length}+</span><p>Artworks</p></div>
            <div className="stat-div"/>
            <div className="stat"><span>100%</span><p>Original</p></div>
            <div className="stat-div"/>
            <div className="stat"><span>❤️</span><p>Made with Love</p></div>
          </div>
        </div>
        <div className="hero-scroll-hint">
          <span>Scroll to explore</span>
          <div className="scroll-line"/>
        </div>
      </section>

      {/* Featured Artworks */}
      <section className="section featured-section">
        <div className="container">
          <div className="section-header">
            <div>
              <p className="section-tag">✦ Handpicked</p>
              <h2 className="section-title">Featured <span className="gold-text">Artworks</span></h2>
              <p className="section-subtitle">Each piece tells a unique story, waiting for the right home.</p>
            </div>
            <Link to="/gallery" className="btn btn-outline">View All</Link>
          </div>
          {loading ? (
            <div className="spinner"/>
          ) : featured.length === 0 ? (
            <div className="empty-state">
              <span>🎨</span>
              <p>Artworks coming soon — check back later!</p>
            </div>
          ) : (
            <div className="grid-4 featured-grid">
              {featured.map(a => <ArtworkCard key={a._id} artwork={a}/>)}
            </div>
          )}
        </div>
      </section>

      {/* About Teaser */}
      <section className="section about-teaser">
        <div className="container about-teaser-inner">
          <div className="about-teaser-text">
            <p className="section-tag">✦ The Artist</p>
            <h2 className="section-title">Meet the <span className="gold-text">Creator</span></h2>
            <p className="about-desc">{settings?.artistBio || 'Passionate artist creating unique, handcrafted artworks with love and dedication.'}</p>
            <Link to="/about" className="btn btn-primary">Learn More</Link>
          </div>
          <div className="about-teaser-art">
            <div className="art-circle">🎨</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      {wa && (
        <section className="section cta-section">
          <div className="container">
            <div className="cta-box">
              <h2>Interested in a piece?</h2>
              <p>Reach out on WhatsApp — quick, easy, and personal.</p>
              <a href={`https://wa.me/${wa}?text=Hi! I found your Laki Arts gallery and I'm interested in purchasing an artwork.`}
                 target="_blank" rel="noreferrer" className="btn btn-whatsapp btn-lg">
                💬 Chat on WhatsApp
              </a>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
