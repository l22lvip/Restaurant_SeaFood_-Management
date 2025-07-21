import React from 'react'
import { FaHome, FaUser, FaSignOutAlt, FaChartLine } from 'react-icons/fa'
import { MdMoney, MdOutlineRestaurantMenu } from "react-icons/md";
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
          <p>Trang chủ</p>
        </button>
        <button
          className={`nav-button ${isActive('/completed-orders') ? 'active' : ''}`}
          onClick={() => navigate('/completed-orders')}
        >
          <MdOutlineReorder className="icon" size={20} />
          <p>Đơn đã hoàn thành</p>
        </button>
        {/* <button
          className={`nav-button ${isActive('/orders') ? 'active' : ''}`}
          onClick={() => navigate('/orders')}
        >
          <MdOutlineReorder className="icon" size={20} />
          <p>Đơn hàng</p>
        </button> */}

{/*         
        <button
          className={`nav-button ${isActive('/create-bill') ? 'active' : ''}`}
          onClick={() => navigate('/create-bill')}
        >
          <MdMoney className="icon" size={20} />
          <p>Thanh toán</p>
        </button> */}


        <button
          className={`nav-button ${isActive('/tables') ? 'active' : ''}`}
          onClick={() => navigate('/tables')}
        >

          <MdTableBar className="icon" size={20} />
          <p>Bàn</p>
        </button>

      </div>
    );
  }

  // Nếu là admin, chỉ hiện Users và nút Đăng xuất
  if (role === 'admin') {
    return (
      <div className="bottom-nav">
        <button
          className={`nav-button ${isActive('/admin/employees') ? 'active' : ''}`}
          onClick={() => navigate('/admin/employees')}
        >
          <FaUser className="icon" size={20} />
          <p>Nhân viên</p>
        </button>
        <button
          className={`nav-button ${isActive('/admin/financial') ? 'active' : ''}`}
          onClick={() => navigate('/admin/financial')}
        >
          <FaChartLine className="icon" size={20} />
          <p>Thu nhập</p>
        </button>
        <button
          className={`nav-button ${isActive('/admin/menu-management') ? 'active' : ''}`}
          onClick={() => navigate('/admin/menu-management')}
        >
          <MdOutlineRestaurantMenu className='icon' size={20} />
          <p>Thực đơn</p>
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


