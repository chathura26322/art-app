import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { FiSlash, FiCheckCircle, FiTrash2, FiMail } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    try {
      const { data } = await api.get('/customers');
      setCustomers(data.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchCustomers(); }, []);

  const handleBan = async (id) => {
    try {
      await api.put(`/customers/${id}/ban`);
      toast.success('Customer status updated');
      fetchCustomers();
    } catch (err) { toast.error('Update failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Permanently delete this customer account?')) return;
    try {
      await api.delete(`/customers/${id}`);
      toast.success('Customer deleted');
      setCustomers(customers.filter(c => c._id !== id));
    } catch (err) { toast.error('Delete failed'); }
  };

  if (loading) return <div className="spinner"></div>;

  return (
    <div className="customers-page">
      <div className="page-header">
        <h1 className="page-title">Manage Customers</h1>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Joined Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(cust => (
              <tr key={cust._id}>
                <td style={{fontWeight: 600}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <div className="avatar-md">{cust.name[0]}</div>
                    {cust.name}
                  </div>
                </td>
                <td>
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-sec)'}}>
                    <FiMail size={14} /> {cust.email}
                  </div>
                </td>
                <td>{new Date(cust.createdAt).toLocaleDateString()}</td>
                <td>
                  <span className={`badge ${cust.isBanned ? 'badge-sold' : 'badge-approved'}`}>
                    {cust.isBanned ? 'Banned' : 'Active'}
                  </span>
                </td>
                <td>
                  <div className="actions-cell">
                    <button onClick={() => handleBan(cust._id)} className="btn-icon" title={cust.isBanned ? 'Unban' : 'Ban'}>
                      {cust.isBanned ? <FiCheckCircle color="#4ade80" /> : <FiSlash color="#f87171" />}
                    </button>
                    <button onClick={() => handleDelete(cust._id)} className="btn-icon" style={{color: '#f87171'}} title="Delete Account"><FiTrash2 /></button>
                  </div>
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan="5" className="empty">No customers registered yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .avatar-md { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #1a1a1a, #111); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 0.9rem; font-weight: 700; color: var(--gold); }
      `}</style>
    </div>
  );
}
