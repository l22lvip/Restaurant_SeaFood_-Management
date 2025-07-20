// Header.js
import React from 'react'
import { FaSearch } from 'react-icons/fa'
import { FaUserCircle } from 'react-icons/fa'
import { FaBell } from 'react-icons/fa'
import logo from '../../assets/images/logo.png'
import logo2 from '../../assets/images/logo-Trongsuot.png'
import logo3 from '../../assets/images/logo-Photoroom.jpg'
import logo4 from '../../assets/images/logo4-done.png'
import '../../css/Header.css'

const Header = () => {
    const role = localStorage.getItem('role');
    if (role === 'admin') {
        return (
            <div className='header-container'>
                <div className='logo-section'>
                    <img src={logo4} className='logo-image' alt='restro logo' style={{ width: '50PX' }} />
                    <h1 className='header-title'>Harbor Fresh</h1>
                </div>
            </div>
        );
    }
    return (
        <div className='header-container'>
            {/* Logo  */}
            <div className='logo-section'>
                <img src={logo4} className='logo-image' alt='restro logo' style={{ width: '50PX' }} />
                <h1 className='header-title'>Harbor Fresh</h1>
            </div>

            {/* Search */}
            <div className='search-section'>
                <FaSearch className='search-icon' />
                <input 
                    type='text'
                    className='search-input'
                    placeholder='Search...'
                />
            </div>

            {/* LOGGED USER DETAIL */}
            <div className='user-section'>
                <div className='notification-section'>
                    <FaBell className='notification-icon' />
                </div>
                <div className='user-profile-section'>
                    <FaUserCircle className='user-icon' />
                    <div className='user-details'>
                        <h1>Nhan Vien 1</h1>
                        <p>User</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header