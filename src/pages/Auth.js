import React, { useState } from 'react';
import logo from '../assets/images/logo4-done.png';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone || !password) {
      setError('Vui lòng nhập đầy đủ số điện thoại và mật khẩu.');
      return;
    }
    // Kiểm tra số điện thoại chỉ chứa số và có độ dài hợp lệ (ví dụ 9-11 số)
    if (!/^\d{9,11}$/.test(phone)) {
      setError('Số điện thoại không hợp lệ.');
      return;
    }
    try {
      const res = await fetch('http://localhost:9999/users');
      const users = await res.json();
      const user = users.find(u => u.phone === phone && u.password === password);
      if (!user) {
        setError('Số điện thoại hoặc mật khẩu không đúng!');
        return;
      }
      localStorage.setItem('role', user.role);
      localStorage.setItem('user', JSON.stringify(user));
      setError('');
      navigate("/admin/employees")
    } catch (err) {
      setError('Lỗi kết nối máy chủ!');
    }
  };

  return (
      <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          minWidth: 340,
          maxWidth: 380,
          width: '100%',
          padding: 36,
          borderRadius: 18,
          background: '#fff',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <img src={logo} alt="Logo" style={{ width: 80, marginBottom: 18, borderRadius: 12, boxShadow: '0 2px 8px #eee' }} />
        <h2 style={{ textAlign: 'center', marginBottom: 28, color: '#1a237e', letterSpacing: 1 }}>Đăng nhập hệ thống</h2>
        <div style={{ width: '100%', marginBottom: 18 }}>
          <label style={{ fontWeight: 500, color: '#3949ab' }}>Số điện thoại</label>
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value.replace(/[^\d]/g, ''))}
            style={{
              width: '100%',
              padding: '10px 14px',
              marginTop: 6,
              border: '1.5px solid #bdbdbd',
              borderRadius: 8,
              outline: 'none',
              fontSize: 16,
              transition: 'border 0.2s',
              boxSizing: 'border-box',
            }}
            placeholder="Nhập số điện thoại"
            maxLength={11}
            onFocus={e => (e.target.style.border = '1.5px solid #3949ab')}
            onBlur={e => (e.target.style.border = '1.5px solid #bdbdbd')}
          />
        </div>
        <div style={{ width: '100%', marginBottom: 18 }}>
          <label style={{ fontWeight: 500, color: '#3949ab' }}>Mật khẩu</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              marginTop: 6,
              border: '1.5px solid #bdbdbd',
              borderRadius: 8,
              outline: 'none',
              fontSize: 16,
              transition: 'border 0.2s',
              boxSizing: 'border-box',
            }}
            placeholder="Nhập mật khẩu"
            onFocus={e => (e.target.style.border = '1.5px solid #3949ab')}
            onBlur={e => (e.target.style.border = '1.5px solid #bdbdbd')}
          />
        </div>
        {error && <div style={{ color: '#d32f2f', marginBottom: 16, width: '100%', textAlign: 'center' }}>{error}</div>}
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '12px 0',
            background: 'linear-gradient(90deg, #3949ab 0%, #1976d2 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontWeight: 'bold',
            fontSize: 17,
            letterSpacing: 1,
            boxShadow: '0 2px 8px #b3c6ff',
            cursor: 'pointer',
            marginTop: 8,
            transition: 'background 0.2s',
          }}
        >
          Đăng nhập
        </button>
      </form>
    </div>
  );
};

export default Auth;