import React from 'react'
import { CiCircleMore } from 'react-icons/ci'
import { FaHome, FaUsers } from 'react-icons/fa'
import { MdOutlineReorder, MdRestaurantMenu, MdTableBar } from 'react-icons/md'
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
        className={`nav-button ${isActive('/staff/') ? 'active' : ''}`}
        onClick={() => navigate('/staff/')}
      >
        <FaHome className="icon" size={20} />
        <p>Home</p>
      </button>
      <button
        className={`nav-button ${isActive('/staff/orders') ? 'active' : ''}`}
        onClick={() => navigate('/staff/orders')}
      >
        <MdOutlineReorder className="icon" size={20} />
        <p>Orders</p>
      </button>
      <button
        className={`nav-button ${isActive('/staff/tables') ? 'active' : ''}`}
        onClick={() => navigate('/staff/tables')}
      >
        <MdTableBar className="icon" size={20} />
        <p>Tables</p>
      </button>
      {/* {isAdmin ? ( */}
        <button
          className={`nav-button ${isActive('/staff/employees') ? 'active' : ''}`}
          onClick={() => navigate('/staff/employees')}
        >
          <FaUsers className="icon" size={20} />
          <p>Employees</p>
        </button>
        <button
          className={`nav-button ${isActive('/staff/menu') ? 'active' : ''}`}
          onClick={() => navigate('/staff/menu')}
        >
          <MdRestaurantMenu  className="icon" size={20} />
          <p>Menu</p>
        </button>
      {/* ) : ( */}
        <button
          className={`nav-button ${isActive('/staff/more') ? 'active' : ''}`}
          onClick={() => navigate('/staff/more')}
        >
          <CiCircleMore className="icon" size={20} />
          <p>More</p>
        </button>
      {/* )} */}
    </div>
  )
}

export default BottomNav