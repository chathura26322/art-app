import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { FiCheck, FiX, FiTrash2, FiImage } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const { data } = await api.get('/reviews/all');
      setReviews(data.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchReviews(); }, []);

  const handleApprove = async (id) => {
    try {
      await api.put(`/reviews/${id}/approve`);
      toast.success('Status updated');
      fetchReviews();
    } catch (err) { toast.error('Update failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await api.delete(`/reviews/${id}`);
      toast.success('Review deleted');
      setReviews(reviews.filter(r => r._id !== id));
    } catch (err) { toast.error('Delete failed'); }
  };

  if (loading) return <div className="spinner"></div>;

  return (
    <div className="reviews-page">
      <div className="page-header">
        <h1 className="page-title">Manage Reviews</h1>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Artwork</th>
              <th>Customer</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map(rev => (
              <tr key={rev._id}>
                <td>
                  <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <FiImage color="var(--gold)" />
                    <span>{rev.artwork?.title || 'Unknown Artwork'}</span>
                  </div>
                </td>
                <td>
                  <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <div className="avatar-sm">{rev.customer?.name?.[0]}</div>
                    <div>
                      <p style={{fontSize: '0.85rem', fontWeight: 600, margin: 0}}>{rev.customer?.name}</p>
                      <p style={{fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0}}>{rev.customer?.email}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{display: 'flex', gap: '2px', color: 'var(--gold)'}}>
                    {[...Array(5)].map((_, i) => <FaStar key={i} size={12} opacity={i < rev.rating ? 1 : 0.2} />)}
                  </div>
                </td>
                <td style={{maxWidth: '250px', fontSize: '0.82rem', color: 'var(--text-sec)'}}>
                  "{rev.comment}"
                </td>
                <td>
                  <span className={`badge ${rev.isApproved ? 'badge-approved' : 'badge-pending'}`}>
                    {rev.isApproved ? 'Public' : 'Pending'}
                  </span>
                </td>
                <td>
                  <div className="actions-cell">
                    <button onClick={() => handleApprove(rev._id)} className={`btn-icon ${rev.isApproved ? '' : 'btn-glow'}`} title={rev.isApproved ? 'Unapprove' : 'Approve'}>
                      {rev.isApproved ? <FiX color="#f87171" /> : <FiCheck color="#4ade80" />}
                    </button>
                    <button onClick={() => handleDelete(rev._id)} className="btn-icon" style={{color: '#f87171'}} title="Delete"><FiTrash2 /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .avatar-sm { width: 30px; height: 30px; border-radius: 50%; background: #222; border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; color: var(--gold); }
        .btn-glow { box-shadow: 0 0 10px rgba(74,222,128,0.15); border-color: rgba(74,222,128,0.4); }
      `}</style>
    </div>
  );
}
