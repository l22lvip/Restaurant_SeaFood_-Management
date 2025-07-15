import React, { useState } from 'react'
import { CiCircleMore } from 'react-icons/ci'
import { FaHome, FaUsers } from 'react-icons/fa'
import { MdOutlineReorder, MdRestaurantMenu, MdTableBar } from 'react-icons/md'
import { useNavigate, useLocation } from 'react-router-dom'
import '../../css/BottomNav.css' // Assuming you have a CSS file for styling
import { BiLogOut } from 'react-icons/bi'

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user')) || {};

  const isActive = (path) => {
    return location.pathname === path;
  };
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  }
  const [isHoverButton, setIsHoverButton] = useState(false)

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
        <MdRestaurantMenu className="icon" size={20} />
        <p>Menu</p>
      </button>
      {/* ) : ( */}
      <button
        className={`nav-button ${isHoverButton ? 'active' : ''}`}
        onMouseEnter={() => {
          setIsHoverButton(true)
        }}
        onMouseLeave={() => {
          setIsHoverButton(false)
        }}
        onClick={() => {
          navigate('/login')
          handleLogout()
        }}
      >
        <BiLogOut className="icon" size={20} />
        <p>Log out</p>
      </button>
      {/* )} */}
    </div>
  )
}

export default BottomNav