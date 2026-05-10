import React from 'react';
import { Link } from 'react-router-dom';
import { FiEye } from 'react-icons/fi';
import './ArtworkCard.css';

export default function ArtworkCard({ artwork }) {
  const img = artwork.images?.[0];
  return (
    <Link to={`/artwork/${artwork._id}`} className="artwork-card">
      <div className="artwork-card-img-wrap">
        {img
          ? <img src={img} alt={artwork.title} loading="lazy" />
          : <div className="artwork-card-placeholder">🎨</div>
        }
        <div className="artwork-card-overlay">
          <span className="artwork-card-view"><FiEye size={18}/> View</span>
        </div>
        <div className="artwork-card-badges">
          {artwork.isFeatured && <span className="badge badge-featured">Featured</span>}
          <span className={`badge ${artwork.isAvailable ? 'badge-available' : 'badge-sold'}`}>
            {artwork.isAvailable ? 'Available' : 'Sold'}
          </span>
        </div>
      </div>
      <div className="artwork-card-info">
        <span className="artwork-card-category">{artwork.category?.name}</span>
        <h3 className="artwork-card-title">{artwork.title}</h3>
        <div className="artwork-card-bottom">
          <span className="artwork-card-price">
            {artwork.currency || 'USD'} {Number(artwork.price).toLocaleString()}
          </span>
        </div>
      </div>
    </Link>
  );
}
