import { useContext, useEffect, useState } from 'react'
import { FaUserCircle } from 'react-icons/fa'
import logo4 from '../../assets/images/logo4-done.png'
import '../../css/Header.css'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

import { UserContext } from './UserContext'

const Header = () => {
    const [currentTime, setCurrentTime] = useState(dayjs());
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user')) || {};

    const { userProfile, fetchProfile } = useContext(UserContext);

    console.log("userProfile", userProfile)
    console.log("user ", user, "User Profile:", userProfile)

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(dayjs());
        }, 1000);
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
                <h3 className="search-icon text-center mb-0 " style={{ width: "120px" }}>
                    {currentTime?.format('HH:mm:ss')}
                </h3>
            </div>

            {/* LOGGED USER DETAIL */}
            <div className='user-section'>
                <div className='user-profile-section' onClick={() => navigate('/staff/profile')}>
                    {
                        userProfile?.imageUrl ? (
                            <img src={userProfile.imageUrl} style={{ width: '40px', height: '40px' }} alt="User Profile" className='user-image rounded-circle' />
                        ) : (
                            <FaUserCircle className='user-icon' />
                        )
                    }

                    <div className='user-details'>
                        <h1 className='mb-0'>{userProfile?.name}</h1>
                        <p className='mb-0'>{userProfile?.role[0].toUpperCase() + userProfile?.role.slice(1)}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header