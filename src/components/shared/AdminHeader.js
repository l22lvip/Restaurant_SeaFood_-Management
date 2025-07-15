import React, { useContext, useEffect, useState } from 'react'
import { FaUserCircle, FaBell } from 'react-icons/fa'
import logo4 from '../../assets/images/logo4-done.png'
import '../../css/Header.css'
import dayjs from 'dayjs'
import { UserContext } from './UserContext'
import { useNavigate } from 'react-router-dom'

const StaffHeader = () => {
    const [currentTime, setCurrentTime] = useState(dayjs());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(dayjs());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const { userProfile, fetchProfile } = useContext(UserContext);

    const navigate = useNavigate();

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            background: 'rgba(255,255,255,0.85)',
            borderRadius: 20,
            boxShadow: '0 4px 24px rgba(220,53,69,0.10)',
            padding: '1.2rem 2rem',
            marginBottom: 32,
            marginTop: 0,
            minHeight: 90,
            backdropFilter: 'blur(8px)',
        }}>
            {/* Logo  */}
            <div style={{ display: 'flex', width: "33%", alignItems: 'center', gap: 16 }}>
                <img src={logo4} alt='restro logo' style={{ width: 48, height: 48, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} />
                <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, letterSpacing: 1, color: '#dc3545' }}>Harbor Staff</h1>
            </div>
            {/* Time */}
            <div style={{ display: 'flex', width: "33%", justifyContent: 'center', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 22, fontWeight: 600, color: '#333', letterSpacing: 1, minWidth: 100, textAlign: 'center' }}>{currentTime?.format('HH:mm:ss')}</span>
            </div>
            {/* LOGGED USER DETAIL */}
            <div style={{ display: 'flex', width: "33%", alignItems: 'center', justifyContent: 'end', gap: 12 }}
                role='button'
                onClick={() => navigate('/staff/profile')}>
                {
                    userProfile?.imageUrl ? (
                        <img src={userProfile.imageUrl} style={{ width: '40px', height: '40px' }} alt="User Profile" className='user-image rounded-circle' />
                    ) : (
                        <FaUserCircle style={{ fontSize: 36, color: '#dc3545' }} className='user-icon' />
                    )
                }
                <div style={{ lineHeight: 1.1 }}>
                    <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0, color: '#222' }}>{userProfile?.name}</h2>
                    <p style={{ fontSize: 14, color: '#888', margin: 0 }}>{userProfile?.role}</p>
                </div>
            </div>
        </div>
    )
}

export default StaffHeader 