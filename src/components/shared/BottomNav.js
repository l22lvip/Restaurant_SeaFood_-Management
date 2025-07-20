import React from 'react'
import { CiCircleMore } from 'react-icons/ci'
import { FaHome, FaUser } from 'react-icons/fa'
import { MdOutlineReorder, MdTableBar } from 'react-icons/md'
import '../../css/BottomNav.css'
import { useNavigate, useLocation } from 'react-router-dom'

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 👉 lấy path hiện tại

  // Hàm kiểm tra active
  const isActive = (path) => location.pathname === path;

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

      <button
        className={`nav-button ${isActive('/users') ? 'active' : ''}`}
        onClick={() => navigate('/users')}
      >
        <FaUser className="icon" size={20} />
        <p>Users</p>
      </button>
      {/* <button
        className={`nav-button ${isActive('/more') ? 'active' : ''}`}
        onClick={() => navigate('/more')}
      >
        <CiCircleMore className="icon" size={20} />
        <p>More</p>
      </button> */}
    </div>
  )
}

export default BottomNav


