import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { FiImage, FiMessageSquare, FiUsers, FiEye } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [stats, setStats] = useState({ artworks: 0, reviews: 0, customers: 0, views: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [artRes, revRes, custRes] = await Promise.all([
          api.get('/artworks'),
          api.get('/reviews/all'),
          api.get('/customers')
        ]);
        
        const artworks = artRes.data.data;
        const totalViews = artworks.reduce((acc, art) => acc + (art.views || 0), 0);
        
        setStats({
          artworks: artRes.data.total,
          reviews: revRes.data.data.length,
          customers: custRes.data.data.length,
          views: totalViews
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const data = [
    { name: 'Artworks', count: stats.artworks },
    { name: 'Reviews', count: stats.reviews },
    { name: 'Customers', count: stats.customers },
  ];

  if (loading) return <div className="spinner"></div>;

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1 className="page-title">Dashboard Overview</h1>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><FiImage /></div>
          <div className="stat-content">
            <p>Total Artworks</p>
            <h3>{stats.artworks}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><FiMessageSquare /></div>
          <div className="stat-content">
            <p>Customer Reviews</p>
            <h3>{stats.reviews}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><FiUsers /></div>
          <div className="stat-content">
            <p>Total Customers</p>
            <h3>{stats.customers}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><FiEye /></div>
          <div className="stat-content">
            <p>Total Gallery Views</p>
            <h3>{stats.views}</h3>
          </div>
        </div>
      </div>

      <div className="dashboard-charts">
        <div className="chart-card card">
          <h4>Platform Activity</h4>
          <div style={{ width: '100%', height: 300, marginTop: '20px' }}>
            <ResponsiveContainer>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis dataKey="name" stroke="#6b6058" fontSize={12} />
                <YAxis stroke="#6b6058" fontSize={12} />
                <Tooltip 
                  contentStyle={{ background: '#1a1a1a', border: '1px solid #d4a853', borderRadius: '8px' }}
                  itemStyle={{ color: '#d4a853' }}
                />
                <Bar dataKey="count" fill="#d4a853" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <style jsx>{`
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .stat-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: var(--radius); padding: 24px; display: flex; align-items: center; gap: 20px; transition: var(--transition); }
        .stat-card:hover { border-color: var(--gold); }
        .stat-icon { width: 50px; height: 50px; background: rgba(212,168,83,0.1); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: var(--gold); font-size: 1.4rem; }
        .stat-content p { font-size: 0.8rem; color: var(--text-sec); margin: 0 0 5px 0; }
        .stat-content h3 { font-size: 1.8rem; margin: 0; font-family: 'Inter', sans-serif; font-weight: 700; }
        .dashboard-charts { display: grid; grid-template-columns: 1fr; gap: 20px; }
        .chart-card { padding: 24px; }
        .chart-card h4 { font-size: 1.1rem; color: var(--gold); }
      `}</style>
    </div>
  );
}
