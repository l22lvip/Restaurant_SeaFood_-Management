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
    const user = JSON.parse(localStorage.getItem('user'));
    if (role === 'admin') {
        return (
            <div className='header-container'>
                <div className='logo-section'>
                    <img src={logo4} className='logo-image' alt='restro logo' style={{ width: '50PX' }} />
                    <h1 className='header-title'>Harbor Fresh</h1>
                </div>
                <div className='user-section' style={{marginLeft: 'auto', display: 'flex', alignItems: 'center'}}>
                    <FaUserCircle className='user-icon' />
                    <div className='user-details'>
                        <h1 style={{fontSize: '1.1rem', margin: 0}}>{user?.name || 'Admin'}</h1>
                        <p style={{fontSize: '0.9rem', margin: 0}}>Admin</p>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className='header-container' style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            {/* Logo  */}
            <div className='logo-section' style={{marginTop: '2px', marginBottom: '2px'}}>
                <img src={logo4} className='logo-image' alt='restro logo' style={{ width: '50PX' }} />
                <h1 className='header-title'>Harbor Fresh</h1>
            </div>

            {/* Search */}
            {/* <div className='search-section'>
                <FaSearch className='search-icon' />
                <input 
                    type='text'
                    className='search-input'
                    placeholder='Search...'
                />
            </div> */}

            {/* LOGGED USER DETAIL */}
            {/* <div className='user-section'>
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
            </div> */}
        </div>
    )
}

export default Header