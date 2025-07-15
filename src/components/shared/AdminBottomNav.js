import React from 'react';
import { FaUserCog, FaUserShield, FaMoneyBillWave } from 'react-icons/fa';
import { MdBarChart } from 'react-icons/md';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../css/BottomNav.css';
import { useState } from 'react'
import { RiRestaurant2Fill } from 'react-icons/ri';
const AdminBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  }
  const [isHoverButton, setIsHoverButton] = useState(false)

  return (
    <div style={{
      position: 'fixed',
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 100,
      background: 'rgba(255,255,255,0.92)',
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      boxShadow: '0 -4px 24px rgba(220,53,69,0.10)',
      padding: '0.5rem 1.5rem 0.7rem 1.5rem',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      maxWidth: 1200,
      margin: '0 auto',
    }}>
      {/* Quản lý tài khoản */}
      <button
        className={`nav-button${isActive('/admin/accounts') ? ' active' : ''}`}
        onClick={() => navigate('/admin/accounts')}
        style={{
          background: isActive('/admin/accounts') ? '#dc3545' : 'transparent',
          color: isActive('/admin/accounts') ? '#fff' : '#dc3545',
          border: 'none',
          borderRadius: 18,
          padding: '0.5rem 1.2rem',
          fontWeight: 600,
          fontSize: 16,
          boxShadow: isActive('/admin/accounts') ? '0 2px 12px rgba(220,53,69,0.12)' : 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transition: 'all 0.18s',
        }}
      >
        <FaUserCog className="icon" size={28} style={{ marginBottom: 2 }} />
        <span style={{ fontSize: 14 }}>Quản lý tài khoản</span>
      </button>

      {/* Quản lý Menu */}
      <button
        className={`nav-button${isActive('/admin/menu') ? ' active' : ''}`}
        onClick={() => navigate('/admin/menu')}
        style={{
          background: isActive('/admin/menu') ? '#dc3545' : 'transparent',
          color: isActive('/admin/menu') ? '#fff' : '#dc3545',
          border: 'none',
          borderRadius: 18,
          padding: '0.5rem 1.2rem',
          fontWeight: 600,
          fontSize: 16,
          boxShadow: isActive('/admin/menu') ? '0 2px 12px rgba(220,53,69,0.12)' : 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transition: 'all 0.18s',
        }}
      >
        <RiRestaurant2Fill className="icon" size={28} style={{ marginBottom: 2 }} />
        <span style={{ fontSize: 14 }}>Quản lý thực đơn</span>
      </button>
      <button
        className={`nav-button${isActive('/admin/dashboard') ? ' active' : ''}`}
        onClick={() => navigate('/admin/dashboard')}
        style={{
          background: isActive('/admin/dashboard') ? '#dc3545' : 'transparent',
          color: isActive('/admin/dashboard') ? '#fff' : '#dc3545',
          border: 'none',
          borderRadius: 18,
          padding: '0.5rem 1.2rem',
          fontWeight: 600,
          fontSize: 16,
          boxShadow: isActive('/admin/dashboard') ? '0 2px 12px rgba(220,53,69,0.12)' : 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transition: 'all 0.18s',
        }}
      >
        <MdBarChart className="icon" size={28} style={{ marginBottom: 2 }} />
        <span style={{ fontSize: 14 }}>Thống kê & Báo cáo</span>
      </button>

      {/* Quản lý Doanh thu */}
      <button
        className={`nav-button${isActive('/admin/revenue') ? ' active' : ''}`}
        onClick={() => navigate('/admin/revenue')}
        style={{
          background: isActive('/admin/revenue') ? '#dc3545' : 'transparent',
          color: isActive('/admin/revenue') ? '#fff' : '#dc3545',
          border: 'none',
          borderRadius: 18,
          padding: '0.5rem 1.2rem',
          fontWeight: 600,
          fontSize: 16,
          boxShadow: isActive('/admin/revenue') ? '0 2px 12px rgba(220,53,69,0.12)' : 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transition: 'all 0.18s',
        }}
      >
        <FaMoneyBillWave className="icon" size={28} style={{ marginBottom: 2 }} />
        <span style={{ fontSize: 14 }}>Quản lý Doanh thu</span>
      </button>
    </div>
  );
};

export default AdminBottomNav;