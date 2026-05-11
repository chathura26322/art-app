import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { FiTrash2, FiUserPlus, FiShield } from 'react-icons/fi';
import { useAdminAuth } from '../context/AdminAuthContext';

export default function Admins() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { admin: currentAdmin } = useAdminAuth();

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchAdmins = async () => {
    try {
      const { data } = await api.get('/auth/admins');
      setAdmins(data.data);
    } catch (err) {
      setError('Failed to load administrators');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');

    try {
      await api.post('/auth/admin/register', formData);
      setFormData({ name: '', email: '', password: '' });
      setShowForm(false);
      fetchAdmins();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create admin');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteAdmin = async (id) => {
    if (!window.confirm('Are you sure you want to remove this administrator?')) return;

    try {
      await api.delete(`/auth/admins/${id}`);
      fetchAdmins();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete admin');
    }
  };

  if (loading) return <div className="spinner"></div>;

  return (
    <div className="admins-page">
      <div className="page-header">
        <h1 className="page-title">Administrator Management</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <FiUserPlus /> {showForm ? 'Cancel' : 'Add New Admin'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ padding: '30px', marginBottom: '30px', maxWidth: '500px' }}>
          <h3 style={{ marginBottom: '20px' }}>Create Admin Account</h3>
          <form onSubmit={handleCreateAdmin}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                className="form-control"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                className="form-control"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                required
                minLength={6}
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            {formError && <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '15px' }}>{formError}</p>}
            <button className="btn btn-primary w-100" disabled={formLoading}>
              {formLoading ? 'Creating...' : 'Create Admin'}
            </button>
          </form>
        </div>
      )}

      {error && <div className="empty">{error}</div>}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Admin Name</th>
              <th>Email</th>
              <th>Joined Date</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map(a => (
              <tr key={a._id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="profile-avatar" style={{ width: '32px', height: '32px', fontSize: '0.9rem' }}>
                      {a.name.charAt(0)}
                    </div>
                    <span style={{ fontWeight: 600 }}>{a.name} {a._id === currentAdmin?._id && <span className="gold-text" style={{ fontSize: '0.7rem' }}>(You)</span>}</span>
                  </div>
                </td>
                <td>{a.email}</td>
                <td style={{ color: 'var(--text-sec)', fontSize: '0.85rem' }}>
                  {new Date(a.createdAt).toLocaleDateString()}
                </td>
                <td>
                  <span className="badge badge-pending"><FiShield size={10} /> Admin</span>
                </td>
                <td>
                  <div className="actions-cell">
                    {a._id !== currentAdmin?._id && (
                      <button className="btn-icon" onClick={() => handleDeleteAdmin(a._id)} title="Delete Admin">
                        <FiTrash2 />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
