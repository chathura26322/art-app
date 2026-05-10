import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('laki_admin_user');
    const token = localStorage.getItem('laki_admin_token');
    if (stored && token) setAdmin(JSON.parse(stored));
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/admin/login', { email, password });
    localStorage.setItem('laki_admin_token', data.token);
    localStorage.setItem('laki_admin_user', JSON.stringify(data.data));
    setAdmin(data.data);
    return data.data;
  };

  const logout = () => {
    localStorage.removeItem('laki_admin_token');
    localStorage.removeItem('laki_admin_user');
    setAdmin(null);
  };

  const loginWithGoogle = async (credential) => {
    const { data } = await api.post('/auth/admin/google', { credential });
    localStorage.setItem('laki_admin_token', data.token);
    localStorage.setItem('laki_admin_user', JSON.stringify(data.data));
    setAdmin(data.data);
    return data.data;
  };

  return (
    <AdminAuthContext.Provider value={{ admin, loading, login, loginWithGoogle, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
