import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const role = localStorage.getItem('role');

  useEffect(() => {
    if (role !== 'admin') {
      navigate('/');
    }
  }, [role, navigate]);

  return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)' }}>
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px #b3c6ff44', padding: 40, minWidth: 340, textAlign: 'center' }}>
        <h1 style={{ color: '#1a237e', marginBottom: 16 }}>Admin Dashboard</h1>
        <p style={{ color: '#3949ab', fontSize: 18, marginBottom: 24 }}>
          Xin chào, <b>{user?.name || 'Admin'}</b>!
        </p>
        <p>Chào mừng bạn đến trang quản trị hệ thống nhà hàng.</p>
        {/* Thêm các widget, thống kê, quản lý... tại đây */}
      </div>
    </div>
  );
};

export default Admin; 