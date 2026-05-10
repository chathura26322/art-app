import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { FiPlus, FiEdit2, FiTrash2, FiExternalLink } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Artworks() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchArtworks = async () => {
    try {
      const { data } = await api.get('/artworks');
      setArtworks(data.data);
    } catch (err) {
      toast.error('Failed to fetch artworks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtworks();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this artwork?')) return;
    try {
      await api.delete(`/artworks/${id}`);
      toast.success('Artwork deleted successfully');
      setArtworks(artworks.filter(a => a._id !== id));
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  if (loading) return <div className="spinner"></div>;

  return (
    <div className="artworks-page">
      <div className="page-header">
        <h1 className="page-title">Manage Artworks</h1>
        <Link to="/artworks/new" className="btn btn-primary">
          <FiPlus /> Add New Artwork
        </Link>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Category</th>
              <th>Price</th>
              <th>Status</th>
              <th>Views</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {artworks.map(art => (
              <tr key={art._id}>
                <td>
                  {art.images?.[0] ? (
                    <img src={art.images[0]} alt="" className="img-preview-sm" />
                  ) : (
                    <div className="img-preview-sm" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111'}}>🎨</div>
                  )}
                </td>
                <td style={{fontWeight: 600}}>{art.title}</td>
                <td><span className="badge badge-pending" style={{background: 'rgba(255,255,255,0.05)', color: '#a89880'}}>{art.category?.name}</span></td>
                <td style={{color: '#d4a853', fontWeight: 600}}>Rs. {Number(art.price).toLocaleString()}</td>
                <td>
                  <span className={`badge ${art.isAvailable ? 'badge-available' : 'badge-sold'}`}>
                    {art.isAvailable ? 'Available' : 'Sold'}
                  </span>
                  {art.isFeatured && <span className="badge badge-approved" style={{marginLeft: '5px', background: 'rgba(212,168,83,0.1)', color: '#d4a853'}}>★ Featured</span>}
                </td>
                <td>{art.views || 0}</td>
                <td>
                  <div className="actions-cell">
                    <a href={`${process.env.REACT_APP_STORE_URL || 'http://localhost:3000'}/artwork/${art._id}`} target="_blank" rel="noreferrer" className="btn-icon" title="View in Store">
                      <FiExternalLink />
                    </a>
                    <Link to={`/artworks/edit/${art._id}`} className="btn-icon" title="Edit">
                      <FiEdit2 />
                    </Link>
                    <button onClick={() => handleDelete(art._id)} className="btn-icon" style={{color: '#f87171'}} title="Delete">
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {artworks.length === 0 && (
              <tr>
                <td colSpan="7" className="empty">No artworks found. Start by adding one!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
