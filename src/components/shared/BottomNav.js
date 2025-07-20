import React from 'react'
import { FaHome, FaUser, FaSignOutAlt, FaChartLine } from 'react-icons/fa'
import { MdOutlineReorder, MdTableBar } from 'react-icons/md'
import '../../css/BottomNav.css'
import { useNavigate, useLocation } from 'react-router-dom'

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  // Nếu chưa đăng nhập hoặc là staff, hiển thị giao diện staff
  if (!role || role === 'staff') {
    return (
      <div className="bottom-nav">
        <button
          className={`nav-button ${isActive('/') ? 'active' : ''}`}
          onClick={() => navigate('/')}
        >
          <FaHome className="icon" size={20} />
          <p>Home</p>
        </button>
        <button
          className={`nav-button ${isActive('/orders') ? 'active' : ''}`}
          onClick={() => navigate('/orders')}
        >
          <MdOutlineReorder className="icon" size={20} />
          <p>Orders</p>
        </button>
        <button
          className={`nav-button ${isActive('/tables') ? 'active' : ''}`}
          onClick={() => navigate('/tables')}
        >
          <MdTableBar className="icon" size={20} />
          <p>Tables</p>
        </button>
      </div>
    );
  }

  // Nếu là admin, chỉ hiện Users và nút Đăng xuất
  if (role === 'admin') {
    return (
      <div className="bottom-nav">
        <button
          className={`nav-button ${isActive('/users') ? 'active' : ''}`}
          onClick={() => navigate('/users')}
        >
          <FaUser className="icon" size={20} />
          <p>Users</p>
        </button>
        <button
          className={`nav-button ${isActive('/financial') ? 'active' : ''}`}
          onClick={() => navigate('/financial')}
        >
          <FaChartLine className="icon" size={20} />
          <p>Finance</p>
        </button>
        <button
          className="nav-button"
          onClick={handleLogout}
        >
          <FaSignOutAlt className="icon" size={20} />
          <p>Đăng xuất</p>
        </button>
      </div>
    );
  }

  return null;
}

export default BottomNav


