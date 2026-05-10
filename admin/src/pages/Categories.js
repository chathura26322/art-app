import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchCategories(); }, []);

  const openModal = (cat = null) => {
    if (cat) {
      setEditingId(cat._id);
      setName(cat.name);
      setDescription(cat.description || '');
    } else {
      setEditingId(null);
      setName('');
      setDescription('');
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/categories/${editingId}`, { name, description });
        toast.success('Category updated');
      } else {
        await api.post('/categories', { name, description });
        toast.success('Category created');
      }
      fetchCategories();
      setShowModal(false);
    } catch (err) { toast.error('Operation failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await api.delete(`/categories/${id}`);
      setCategories(categories.filter(c => c._id !== id));
      toast.success('Deleted');
    } catch (err) { toast.error('Delete failed'); }
  };

  if (loading) return <div className="spinner"></div>;

  return (
    <div className="categories-page">
      <div className="page-header">
        <h1 className="page-title">Artwork Categories</h1>
        <button onClick={() => openModal()} className="btn btn-primary"><FiPlus /> Add Category</button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Slug</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat._id}>
                <td style={{fontWeight: 600}}>{cat.name}</td>
                <td style={{color: 'var(--text-sec)'}}>{cat.description || '-'}</td>
                <td><code style={{color: 'var(--gold)'}}>{cat.slug}</code></td>
                <td>
                  <div className="actions-cell">
                    <button onClick={() => openModal(cat)} className="btn-icon" title="Edit"><FiEdit2 /></button>
                    <button onClick={() => handleDelete(cat._id)} className="btn-icon" style={{color: '#f87171'}} title="Delete"><FiTrash2 /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal card">
            <h2>{editingId ? 'Edit Category' : 'New Category'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Category Name</label>
                <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Description (Optional)</label>
                <textarea className="form-control" value={description} onChange={e => setDescription(e.target.value)} />
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Category</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 2000; padding: 20px; }
        .modal { width: 100%; max-width: 450px; padding: 30px; }
        .modal h2 { font-size: 1.4rem; margin-bottom: 24px; color: var(--gold); }
        .modal-footer { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; }
      `}</style>
    </div>
  );
}
