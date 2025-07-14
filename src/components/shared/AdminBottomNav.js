import React from 'react'
import { CiCircleMore } from 'react-icons/ci'
import { FaHome, FaUsers } from 'react-icons/fa'
import { MdOutlineReorder, MdTableBar } from 'react-icons/md'
import { useNavigate, useLocation } from 'react-router-dom'
import '../../css/BottomNav.css' // Assuming you have a CSS file for styling

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = localStorage.getItem('userRole') === 'admin'; // Check if user is admin

  const isActive = (path) => {
    return location.pathname === path;
  };

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
      {/* {isAdmin ? ( */}
        <button
          className={`nav-button ${isActive('/employees') ? 'active' : ''}`}
          onClick={() => navigate('/employees')}
        >
          <FaUsers className="icon" size={20} />
          <p>Employees</p>
        </button>
      {/* ) : ( */}
        <button
          className={`nav-button ${isActive('/more') ? 'active' : ''}`}
          onClick={() => navigate('/more')}
        >
          <CiCircleMore className="icon" size={20} />
          <p>More</p>
        </button>
      {/* )} */}
    </div>
  )
}

export default BottomNav