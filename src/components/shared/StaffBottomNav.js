import React from 'react';
import { MdOutlineReorder, MdUpdate, MdPayment, MdPrint } from 'react-icons/md';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../css/BottomNav.css';

const StaffBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

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
      {/* Xem & xác nhận đơn hàng */}
      <button
        className={`nav-button${isActive('/staff/orders') ? ' active' : ''}`}
        onClick={() => navigate('/staff/orders')}
        style={{
          background: isActive('/staff/orders') ? '#dc3545' : 'transparent',
          color: isActive('/staff/orders') ? '#fff' : '#dc3545',
          border: 'none',
          borderRadius: 18,
          padding: '0.5rem 1.2rem',
          fontWeight: 600,
          fontSize: 16,
          boxShadow: isActive('/staff/orders') ? '0 2px 12px rgba(220,53,69,0.12)' : 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transition: 'all 0.18s',
        }}
      >
        <MdOutlineReorder className="icon" size={28} style={{ marginBottom: 2 }} />
        <span style={{ fontSize: 14 }}>Đơn hàng</span>
      </button>
      {/* Cập nhật trạng thái đơn hàng */}
      <button
        className={`nav-button${isActive('/staff/update-status') ? ' active' : ''}`}
        onClick={() => navigate('/staff/update-status')}
        style={{
          background: isActive('/staff/update-status') ? '#dc3545' : 'transparent',
          color: isActive('/staff/update-status') ? '#fff' : '#dc3545',
          border: 'none',
          borderRadius: 18,
          padding: '0.5rem 1.2rem',
          fontWeight: 600,
          fontSize: 16,
          boxShadow: isActive('/staff/update-status') ? '0 2px 12px rgba(220,53,69,0.12)' : 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transition: 'all 0.18s',
        }}
      >
        <MdUpdate className="icon" size={28} style={{ marginBottom: 2 }} />
        <span style={{ fontSize: 14 }}>Cập nhật trạng thái</span>
      </button>
      {/* Xử lý thanh toán */}
      <button
        className={`nav-button${isActive('/staff/payment') ? ' active' : ''}`}
        onClick={() => navigate('/staff/payment')}
        style={{
          background: isActive('/staff/payment') ? '#dc3545' : 'transparent',
          color: isActive('/staff/payment') ? '#fff' : '#dc3545',
          border: 'none',
          borderRadius: 18,
          padding: '0.5rem 1.2rem',
          fontWeight: 600,
          fontSize: 16,
          boxShadow: isActive('/staff/payment') ? '0 2px 12px rgba(220,53,69,0.12)' : 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transition: 'all 0.18s',
        }}
      >
        <MdPayment className="icon" size={28} style={{ marginBottom: 2 }} />
        <span style={{ fontSize: 14 }}>Thanh toán</span>
      </button>
      {/* In hóa đơn */}
      <button
        className={`nav-button${isActive('/staff/print-bill') ? ' active' : ''}`}
        onClick={() => navigate('/staff/print-bill')}
        style={{
          background: isActive('/staff/print-bill') ? '#dc3545' : 'transparent',
          color: isActive('/staff/print-bill') ? '#fff' : '#dc3545',
          border: 'none',
          borderRadius: 18,
          padding: '0.5rem 1.2rem',
          fontWeight: 600,
          fontSize: 16,
          boxShadow: isActive('/staff/print-bill') ? '0 2px 12px rgba(220,53,69,0.12)' : 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transition: 'all 0.18s',
        }}
      >
        <MdPrint className="icon" size={28} style={{ marginBottom: 2 }} />
        <span style={{ fontSize: 14 }}>In hóa đơn</span>
      </button>
    </div>
  );
};

export default StaffBottomNav;