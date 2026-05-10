import React, { useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import ArtworkCard from '../components/ArtworkCard';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import './Gallery.css';

export default function Gallery() {
  const [artworks, setArtworks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [available, setAvailable] = useState('');

  const fetchArtworks = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 12, sort: '-createdAt' });
      if (search) params.set('search', search);
      if (category) params.set('category', category);
      if (available !== '') params.set('available', available);
      const { data } = await api.get(`/artworks?${params}`);
      setArtworks(data.data); setTotal(data.total);
      setPages(data.pages);
    } finally { setLoading(false); }
  }, [page, search, category, available]);

  useEffect(() => { fetchArtworks(); }, [fetchArtworks]);

  useEffect(() => {
    api.get('/categories').then(r => setCategories(r.data.data));
  }, []);

  const resetFilters = () => { setSearch(''); setCategory(''); setAvailable(''); setPage(1); };

  return (
    <div className="gallery-page page-enter">
      <div className="gallery-hero">
        <div className="container">
          <p className="section-tag">✦ Browse</p>
          <h1 className="section-title">The <span className="gold-text">Gallery</span></h1>
          <p className="section-subtitle">{total} original artworks available</p>
        </div>
      </div>

      <div className="container gallery-content">
        {/* Filters */}
        <div className="filters-bar">
          <div className="search-box">
            <FiSearch size={16} className="search-icon"/>
            <input
              className="form-control search-input"
              placeholder="Search artworks..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
            {search && <button className="search-clear" onClick={() => setSearch('')}><FiX size={14}/></button>}
          </div>

          <div className="filter-group">
            <FiFilter size={16} className="filter-icon"/>
            <select className="form-control" value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}>
              <option value="">All Categories</option>
              {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>

          <div className="filter-group">
            <select className="form-control" value={available} onChange={e => { setAvailable(e.target.value); setPage(1); }}>
              <option value="">All Status</option>
              <option value="true">Available</option>
              <option value="false">Sold</option>
            </select>
          </div>

          {(search || category || available !== '') && (
            <button className="btn btn-outline btn-sm" onClick={resetFilters}>
              <FiX size={14}/> Clear
            </button>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="spinner"/>
        ) : artworks.length === 0 ? (
          <div className="empty-state" style={{ padding: '80px' }}>
            <span>🎨</span>
            <p>No artworks found. Try adjusting your filters.</p>
          </div>
        ) : (
          <>
            <div className="grid-3">
              {artworks.map(a => <ArtworkCard key={a._id} artwork={a}/>)}
            </div>
            {pages > 1 && (
              <div className="pagination">
                {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                  <button key={p} className={`page-btn ${p === page ? 'active' : ''}`} onClick={() => setPage(p)}>
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
