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
        className={`nav-button ${isActive('/admin/') ? 'active' : ''}`}
        onClick={() => navigate('/admin/')}
      >
        <FaHome className="icon" size={20} />
        <p>Home</p>
      </button>
      <button
        className={`nav-button ${isActive('/admin/orders') ? 'active' : ''}`}
        onClick={() => navigate('/admin/orders')}
      >
        <MdOutlineReorder className="icon" size={20} />
        <p>Orders</p>
      </button>
      <button
        className={`nav-button ${isActive('/admin/tables') ? 'active' : ''}`}
        onClick={() => navigate('/admin/tables')}
      >
        <MdTableBar className="icon" size={20} />
        <p>Tables</p>
      </button>
      {/* {isAdmin ? ( */}
        <button
          className={`nav-button ${isActive('/admin/employees') ? 'active' : ''}`}
          onClick={() => navigate('/admin/employees')}
        >
          <FaUsers className="icon" size={20} />
          <p>Employees</p>
        </button>
      {/* ) : ( */}
        <button
          className={`nav-button ${isActive('/admin/more') ? 'active' : ''}`}
          onClick={() => navigate('/admin/more')}
        >
          <CiCircleMore className="icon" size={20} />
          <p>More</p>
        </button>
      {/* )} */}
    </div>
  )
}

export default BottomNav