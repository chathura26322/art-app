import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { FiArrowLeft, FiUpload, FiX } from 'react-icons/fi';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';

export default function ArtworkForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: '', description: '', price: '', category: '', 
    dimensions: '', medium: '', isAvailable: true, 
    isFeatured: false, tags: ''
  });
  const [images, setImages] = useState([]); // Selected for upload
  const [existingImages, setExistingImages] = useState([]); // Already in Cloudinary

  const fetchCategories = async () => {
    const { data } = await api.get('/categories');
    setCategories(data.data);
  };

  const fetchArtwork = useCallback(async () => {
    const { data } = await api.get(`/artworks/${id}`);
    const art = data.data;
    setForm({
      title: art.title,
      description: art.description,
      price: art.price,
      category: art.category?._id || '',
      dimensions: art.dimensions || '',
      medium: art.medium || '',
      isAvailable: art.isAvailable,
      isFeatured: art.isFeatured,
      tags: art.tags?.join(', ') || ''
    });
    setExistingImages(art.images || []);
  }, [id]);

  useEffect(() => {
    fetchCategories();
    if (isEdit) fetchArtwork();
  }, [isEdit, fetchArtwork]);

  const onDrop = useCallback(acceptedFiles => {
    setImages(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: {'image/*': []} });

  const removeSelectedImage = (index) => setImages(images.filter((_, i) => i !== index));
  const removeExistingImage = (url) => setExistingImages(existingImages.filter(u => u !== url));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category) return toast.error('Please select a category');
    
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => formData.append(key, form[key]));
      images.forEach(img => formData.append('images', img));
      
      if (isEdit) {
        existingImages.forEach(img => formData.append('keepImages', img));
        await api.put(`/artworks/${id}`, formData);
        toast.success('Artwork updated!');
      } else {
        await api.post('/artworks', formData);
        toast.success('Artwork created!');
      }
      navigate('/artworks');
    } catch (err) {
      toast.error('Save failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="artwork-form-page">
      <div className="page-header">
        <button onClick={() => navigate('/artworks')} className="btn btn-outline btn-sm">
          <FiArrowLeft /> Back
        </button>
        <h1 className="page-title">{isEdit ? 'Edit Artwork' : 'New Artwork'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="form-layout card">
        <div className="form-section">
          <h3>Basic Information</h3>
          <div className="form-group">
            <label>Artwork Title</label>
            <input 
              type="text" className="form-control" 
              value={form.title} onChange={e => setForm({...form, title: e.target.value})}
              placeholder="e.g. Midnight Serenade" required 
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea 
              className="form-control" 
              value={form.description} onChange={e => setForm({...form, description: e.target.value})}
              placeholder="Tell the story behind this piece..." required 
            />
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label>Category</label>
              <select 
                className="form-control"
                value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                required
              >
                <option value="">Select Category</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Price (USD)</label>
              <input 
                type="number" className="form-control" 
                value={form.price} onChange={e => setForm({...form, price: e.target.value})}
                placeholder="0.00" required 
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Artwork Details</h3>
          <div className="grid-2">
            <div className="form-group">
              <label>Medium (e.g. Oil on Canvas)</label>
              <input type="text" className="form-control" value={form.medium} onChange={e => setForm({...form, medium: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Dimensions (e.g. 24" x 36")</label>
              <input type="text" className="form-control" value={form.dimensions} onChange={e => setForm({...form, dimensions: e.target.value})} />
            </div>
          </div>
          <div className="form-group">
            <label>Tags (comma separated)</label>
            <input type="text" className="form-control" value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} placeholder="landscape, nature, blue..." />
          </div>
          <div className="checkbox-row">
            <label className="checkbox-wrap">
              <input type="checkbox" checked={form.isAvailable} onChange={e => setForm({...form, isAvailable: e.target.checked})} />
              <span>Mark as Available</span>
            </label>
            <label className="checkbox-wrap">
              <input type="checkbox" checked={form.isFeatured} onChange={e => setForm({...form, isFeatured: e.target.checked})} />
              <span>Feature on Homepage</span>
            </label>
          </div>
        </div>

        <div className="form-section">
          <h3>Gallery Images</h3>
          <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
            <input {...getInputProps()} />
            <FiUpload size={24} />
            <p>Drag & drop images here, or click to select</p>
            <span className="text-muted">Maximum 5 images, WebP/JPG/PNG</span>
          </div>

          <div className="image-preview-grid">
            {/* Existing Images */}
            {existingImages.map(url => (
              <div key={url} className="preview-item">
                <img src={url} alt="" />
                <button type="button" onClick={() => removeExistingImage(url)} className="remove-btn"><FiX /></button>
              </div>
            ))}
            {/* New Selected Images */}
            {images.map((file, idx) => (
              <div key={idx} className="preview-item new">
                <img src={URL.createObjectURL(file)} alt="" />
                <button type="button" onClick={() => removeSelectedImage(idx)} className="remove-btn"><FiX /></button>
                <span className="new-badge">NEW</span>
              </div>
            ))}
          </div>
        </div>

        <div className="form-footer">
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? 'Saving...' : (isEdit ? 'Update Artwork' : 'Create Artwork')}
          </button>
        </div>
      </form>

      <style jsx>{`
        .form-layout { padding: 40px; margin-top: 20px; }
        .form-section { margin-bottom: 40px; }
        .form-section h3 { font-size: 1.1rem; color: var(--gold); margin-bottom: 20px; border-bottom: 1px solid var(--border); padding-bottom: 10px; }
        .checkbox-row { display: flex; gap: 30px; margin-top: 10px; }
        .checkbox-wrap { display: flex; align-items: center; gap: 10px; cursor: pointer; font-size: 0.9rem; }
        .checkbox-wrap input { width: 18px; height: 18px; accent-color: var(--gold); }
        .dropzone { border: 2px dashed var(--border); border-radius: var(--radius); padding: 40px; text-align: center; color: var(--text-sec); cursor: pointer; transition: var(--transition); }
        .dropzone:hover, .dropzone.active { border-color: var(--gold); background: rgba(212,168,83,0.03); color: var(--gold); }
        .image-preview-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 15px; margin-top: 20px; }
        .preview-item { position: relative; aspect-ratio: 1; border-radius: 8px; overflow: hidden; border: 1px solid var(--border); }
        .preview-item img { width: 100%; height: 100%; object-fit: cover; }
        .preview-item.new { border-color: var(--gold); }
        .remove-btn { position: absolute; top: 5px; right: 5px; background: rgba(248,113,113,0.9); color: white; border: none; border-radius: 4px; padding: 4px; display: flex; transition: 0.2s; }
        .remove-btn:hover { background: #f87171; }
        .new-badge { position: absolute; bottom: 5px; left: 5px; background: var(--gold); color: #0d0d0d; font-size: 0.6rem; font-weight: 800; padding: 2px 6px; border-radius: 4px; }
        .form-footer { border-top: 1px solid var(--border); padding-top: 30px; display: flex; justify-content: flex-end; }
      `}</style>
    </div>
  );
}
