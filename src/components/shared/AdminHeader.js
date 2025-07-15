// Header.js
import React, { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { FaUserCircle } from 'react-icons/fa'
import { FaBell } from 'react-icons/fa'
import logo from '../../assets/images/logo.png'
import logo2 from '../../assets/images/logo-Trongsuot.png'
import logo3 from '../../assets/images/logo-Photoroom.jpg'
import logo4 from '../../assets/images/logo4-done.png'
import '../../css/Header.css'
import dayjs from 'dayjs'

const Header = () => {
    const [currentTime, setCurrentTime] = useState(dayjs());

    const user = JSON.parse(localStorage.getItem('user')) || {};

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(dayjs());
        }, 1000); // update mỗi giây
        return () => clearInterval(interval);
    }, []);
    return (
        <div className='header-container'>
            {/* Logo  */}
            <div className='logo-section'>
                <img src={logo4} className='logo-image' alt='restro logo' style={{ width: '50PX' }} />
                <h1 className='header-title'>Harbor Fresh</h1>
            </div>

            {/* Search */}
            <div className="search-section justify-content-center">
                <h3 className="search-icon text-center mb-0 " style={{width:"120px"}}>
                    {currentTime?.format('HH:mm:ss')}
                </h3>
            </div>

            {/* LOGGED USER DETAIL */}
            <div className='user-section'>
                <div className='user-profile-section'>
                    <FaUserCircle className='user-icon' />
                    <div className='user-details'>
                        <h1 className='mb-0'>{user?.name}</h1>
                        <p  className='mb-0'>{user?.role[0].toUpperCase() + user?.role.slice(1)}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header