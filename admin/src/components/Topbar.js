import React from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { FiUser } from 'react-icons/fi';
import './Topbar.css';

export default function Topbar() {
  const { admin } = useAdminAuth();

  return (
    <header className="topbar">
      <div className="topbar-left">
        <span className="breadcrumb">Admin / <strong>Dashboard</strong></span>
      </div>
      <div className="topbar-right">
        <div className="admin-profile">
          <div className="profile-info">
            <p className="profile-name">{admin?.name}</p>
            <p className="profile-role">Administrator</p>
          </div>
          <div className="profile-avatar"><FiUser /></div>
        </div>
      </div>
    </header>
  );
}
