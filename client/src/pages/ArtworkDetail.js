import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FaWhatsapp, FaStar, FaRegStar } from 'react-icons/fa';
import { FiArrowLeft, FiEye, FiTag } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './ArtworkDetail.css';

const StarRating = ({ value, onChange }) => (
  <div className="star-picker">
    {[1,2,3,4,5].map(s => (
      <button key={s} type="button" onClick={() => onChange(s)} className="star-btn">
        {s <= value ? <FaStar color="#d4a853" size={22}/> : <FaRegStar color="#6b6058" size={22}/>}
      </button>
    ))}
  </div>
);

const DisplayStars = ({ rating }) => (
  <div className="stars">
    {[1,2,3,4,5].map(s => s <= Math.round(rating)
      ? <FaStar key={s} color="#d4a853" size={14}/>
      : <FaRegStar key={s} color="#6b6058" size={14}/>
    )}
  </div>
);

export default function ArtworkDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [artwork, setArtwork] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [settings, setSettings] = useState(null);
  const [selectedImg, setSelectedImg] = useState(0);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get(`/artworks/${id}`),
      api.get(`/reviews?artworkId=${id}`),
      api.get('/settings'),
    ]).then(([a, r, s]) => {
      setArtwork(a.data.data);
      setReviews(r.data.data);
      setSettings(s.data.data);
    }).finally(() => setLoading(false));
  }, [id]);

  const wa = settings?.whatsappNumber?.replace(/\D/g, '');
  const waMsg = artwork ? encodeURIComponent(`Hi! I'm interested in buying "${artwork.title}" priced at ${artwork.currency} ${artwork.price}. Is it still available?`) : '';

  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null;

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Please sign in to leave a review');
    if (rating === 0) return toast.error('Please select a star rating');
    if (!comment.trim()) return toast.error('Please write a comment');
    setSubmitting(true);
    try {
      await api.post('/reviews', { artworkId: id, rating, comment });
      toast.success('Review submitted! It will appear after admin approval 🎉');
      setRating(0); setComment('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not submit review');
    } finally { setSubmitting(false); }
  };

  if (loading) return <div className="spinner" style={{ marginTop: '120px' }}/>;
  if (!artwork) return <div className="container" style={{ paddingTop: '120px' }}>Artwork not found.</div>;

  return (
    <div className="detail-page page-enter">
      <div className="container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FiArrowLeft size={16}/> Back to Gallery
        </button>

        <div className="detail-grid">
          {/* Images */}
          <div className="detail-images">
            <div className="main-image">
              {artwork.images?.[selectedImg]
                ? <img src={artwork.images[selectedImg]} alt={artwork.title}/>
                : <div className="img-placeholder">🎨</div>
              }
            </div>
            {artwork.images?.length > 1 && (
              <div className="thumb-row">
                {artwork.images.map((img, i) => (
                  <button key={i} className={`thumb ${i === selectedImg ? 'active' : ''}`} onClick={() => setSelectedImg(i)}>
                    <img src={img} alt={`view ${i+1}`}/>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="detail-info">
            <div className="detail-badges">
              <span className="badge badge-cat">{artwork.category?.name}</span>
              <span className={`badge ${artwork.isAvailable ? 'badge-available' : 'badge-sold'}`}>
                {artwork.isAvailable ? 'Available' : 'Sold'}
              </span>
              {artwork.isFeatured && <span className="badge badge-featured">Featured</span>}
            </div>
            <h1 className="detail-title">{artwork.title}</h1>

            {avgRating && (
              <div className="detail-rating">
                <DisplayStars rating={avgRating}/>
                <span>{avgRating} ({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
              </div>
            )}

            <div className="detail-price">
              {artwork.currency || 'USD'} <strong>{Number(artwork.price).toLocaleString()}</strong>
            </div>

            <p className="detail-desc">{artwork.description}</p>

            <div className="detail-meta">
              {artwork.medium && <div><span>Medium</span><p>{artwork.medium}</p></div>}
              {artwork.dimensions && <div><span>Size</span><p>{artwork.dimensions}</p></div>}
              <div><span><FiEye size={12}/> Views</span><p>{artwork.views}</p></div>
            </div>

            {artwork.tags?.length > 0 && (
              <div className="detail-tags">
                <FiTag size={13}/> {artwork.tags.map(t => <span key={t} className="tag">#{t}</span>)}
              </div>
            )}

            <div className="detail-actions">
              {artwork.isAvailable && wa ? (
                <a href={`https://wa.me/${wa}?text=${waMsg}`} target="_blank" rel="noreferrer" className="btn btn-whatsapp btn-lg">
                  <FaWhatsapp size={20}/> Buy via WhatsApp
                </a>
              ) : !artwork.isAvailable ? (
                <div className="sold-notice">This artwork has been sold. More pieces coming soon!</div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="reviews-section">
          <h2 className="section-title">Customer <span className="gold-text">Reviews</span></h2>

          {reviews.length === 0 ? (
            <p className="no-reviews">No reviews yet. Be the first to share your experience!</p>
          ) : (
            <div className="reviews-list">
              {reviews.map(r => (
                <div key={r._id} className="review-card">
                  <div className="review-header">
                    <div className="review-avatar">{r.customer?.name?.[0]?.toUpperCase() || 'U'}</div>
                    <div>
                      <p className="review-name">{r.customer?.name || 'Anonymous'}</p>
                      <div className="review-meta">
                        <DisplayStars rating={r.rating}/>
                        <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <p className="review-text">{r.comment}</p>
                </div>
              ))}
            </div>
          )}

          {/* Submit Review */}
          <div className="review-form-wrap">
            <h3>Leave a Review</h3>
            {user ? (
              <form onSubmit={submitReview} className="review-form">
                <div className="form-group">
                  <label>Your Rating</label>
                  <StarRating value={rating} onChange={setRating}/>
                </div>
                <div className="form-group">
                  <label>Your Comment</label>
                  <textarea
                    className="form-control"
                    placeholder="Share your experience with this artwork..."
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    rows={4}
                  />
                </div>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            ) : (
              <div className="login-prompt">
                <p>Please <a href="/login" className="gold-text">sign in</a> to leave a review.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
