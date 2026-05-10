import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { FiSave, FiInfo, FiSmartphone, FiLayout, FiLink } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Settings() {
  const [form, setForm] = useState({
    artistName: '', artistBio: '', whatsappNumber: '',
    heroBannerText: '', heroSubText: '',
    socialLinks: { instagram: '', facebook: '' }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/settings').then(r => {
      setForm(r.data.data);
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/settings', form);
      toast.success('Settings updated successfully!');
    } catch (err) { toast.error('Update failed'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="spinner"></div>;

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1 className="page-title">Site Settings</h1>
      </div>

      <form onSubmit={handleSubmit} className="settings-grid">
        <div className="settings-main">
          {/* General */}
          <div className="settings-card card">
            <div className="card-header"><FiInfo /> <h3>Artist Profile</h3></div>
            <div className="card-body">
              <div className="form-group">
                <label>Artist / Brand Name</label>
                <input type="text" className="form-control" value={form.artistName} onChange={e => setForm({...form, artistName: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Artist Biography</label>
                <textarea className="form-control" value={form.artistBio} onChange={e => setForm({...form, artistBio: e.target.value})} rows={5} />
              </div>
            </div>
          </div>

          {/* Hero Section */}
          <div className="settings-card card">
            <div className="card-header"><FiLayout /> <h3>Homepage Hero</h3></div>
            <div className="card-body">
              <div className="form-group">
                <label>Hero Heading</label>
                <input type="text" className="form-control" value={form.heroBannerText} onChange={e => setForm({...form, heroBannerText: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Hero Subtext</label>
                <textarea className="form-control" value={form.heroSubText} onChange={e => setForm({...form, heroSubText: e.target.value})} rows={3} />
              </div>
            </div>
          </div>
        </div>

        <div className="settings-sidebar">
          {/* WhatsApp */}
          <div className="settings-card card">
            <div className="card-header"><FiSmartphone /> <h3>Contact Info</h3></div>
            <div className="card-body">
              <div className="form-group">
                <label>WhatsApp Number (with country code)</label>
                <input 
                  type="text" className="form-control" 
                  value={form.whatsappNumber} onChange={e => setForm({...form, whatsappNumber: e.target.value})} 
                  placeholder="+94 77 123 4567"
                />
                <p className="help-text">Used for the "Buy via WhatsApp" button on artwork pages.</p>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="settings-card card">
            <div className="card-header"><FiLink /> <h3>Social Links</h3></div>
            <div className="card-body">
              <div className="form-group">
                <label>Instagram URL</label>
                <input type="text" className="form-control" value={form.socialLinks?.instagram} onChange={e => setForm({...form, socialLinks: {...form.socialLinks, instagram: e.target.value}})} placeholder="https://instagram.com/..." />
              </div>
              <div className="form-group">
                <label>Facebook URL</label>
                <input type="text" className="form-control" value={form.socialLinks?.facebook} onChange={e => setForm({...form, socialLinks: {...form.socialLinks, facebook: e.target.value}})} placeholder="https://facebook.com/..." />
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg save-btn" disabled={saving}>
            <FiSave /> {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </form>

      <style jsx>{`
        .settings-grid { display: grid; grid-template-columns: 1fr 380px; gap: 30px; }
        .settings-card { margin-bottom: 30px; }
        .card-header { padding: 18px 24px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 12px; color: var(--gold); }
        .card-header h3 { font-size: 1rem; margin: 0; }
        .card-body { padding: 24px; }
        .help-text { font-size: 0.72rem; color: var(--text-muted); margin-top: 6px; }
        .save-btn { width: 100%; justify-content: center; height: 50px; font-size: 1rem; position: sticky; bottom: 30px; box-shadow: 0 10px 20px rgba(0,0,0,0.3); }
        @media (max-width: 1024px) { .settings-grid { grid-template-columns: 1fr; } .settings-sidebar { position: static; } }
      `}</style>
    </div>
  );
}
