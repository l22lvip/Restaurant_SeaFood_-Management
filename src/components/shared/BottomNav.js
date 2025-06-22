import React from 'react'
import { CiCircleMore } from 'react-icons/ci'
import { FaHome } from 'react-icons/fa'
import { MdOutlineReorder, MdTableBar } from 'react-icons/md'
import '../../css/BottomNav.css' // Assuming you have a CSS file for styling

const BottomNav = () => {
    return (
        <div className="bottom-nav">
      <button className="nav-button active">
        <FaHome className="icon" size={20} />
        <p>Home</p>
      </button>
      <button className="nav-button">
        <MdOutlineReorder className="icon" size={20} />
        <p>Orders</p>
      </button>
      <button className="nav-button">
        <MdTableBar className="icon" size={20} />
        <p>Tables</p>
      </button>
      <button className="nav-button">
        <CiCircleMore className="icon" size={20} />
        <p>More</p>
      </button>
    </div>
    )
}

export default BottomNav