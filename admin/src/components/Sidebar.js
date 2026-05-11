import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiUsers, FiSettings, FiLogOut, FiShield 
} from 'react-icons/fi';
import { useAdminAuth } from '../context/AdminAuthContext';
import './Sidebar.css';

export default function Sidebar() {
  const { logout } = useAdminAuth();

  const links = [
    { to: '/', icon: <FiGrid />, label: 'Dashboard' },
    { to: '/artworks', icon: <FiImage />, label: 'Artworks' },
    { to: '/categories', icon: <FiFolder />, label: 'Categories' },
    { to: '/reviews', icon: <FiMessageSquare />, label: 'Reviews' },
    { to: '/customers', icon: <FiUsers />, label: 'Customers' },
    { to: '/settings', icon: <FiSettings />, label: 'Settings' },
    { to: '/admins', icon: <FiShield />, label: 'Administrators' },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <span>🎨</span> Laki <span className="gold-text">Admin</span>
      </div>
      <nav className="sidebar-nav">
        {links.map(link => (
          <NavLink key={link.to} to={link.to} end={link.to === '/'} className="nav-item">
            {link.icon} <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <button onClick={logout} className="nav-item logout-btn">
          <FiLogOut /> <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
