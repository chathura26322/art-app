import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAdminAuth } from './context/AdminAuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Artworks from './pages/Artworks';
import ArtworkForm from './pages/ArtworkForm';
import Categories from './pages/Categories';
import Reviews from './pages/Reviews';
import Customers from './pages/Customers';
import Settings from './pages/Settings';
import Admins from './pages/Admins';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import './App.css';

const PrivateRoute = ({ children }) => {
  const { admin, loading } = useAdminAuth();
  if (loading) return <div className="spinner" style={{marginTop: '20vh'}}></div>;
  return admin ? children : <Navigate to="/login" />;
};

function App() {
  const { admin } = useAdminAuth();

  return (
    <BrowserRouter>
      <div className="admin-app">
        {admin && <Sidebar />}
        <div className="admin-main">
          {admin && <Topbar />}
          <div className={admin ? "admin-content" : ""}>
            <Routes>
              <Route path="/login" element={!admin ? <Login /> : <Navigate to="/" />} />
              <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/artworks" element={<PrivateRoute><Artworks /></PrivateRoute>} />
              <Route path="/artworks/new" element={<PrivateRoute><ArtworkForm /></PrivateRoute>} />
              <Route path="/artworks/edit/:id" element={<PrivateRoute><ArtworkForm /></PrivateRoute>} />
              <Route path="/categories" element={<PrivateRoute><Categories /></PrivateRoute>} />
              <Route path="/reviews" element={<PrivateRoute><Reviews /></PrivateRoute>} />
              <Route path="/customers" element={<PrivateRoute><Customers /></PrivateRoute>} />
              <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
              <Route path="/admins" element={<PrivateRoute><Admins /></PrivateRoute>} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
