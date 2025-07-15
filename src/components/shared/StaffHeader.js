import React, { useEffect, useState } from 'react'
import { FaUserCircle, FaBell } from 'react-icons/fa'
import logo4 from '../../assets/images/logo4-done.png'
import '../../css/Header.css'
import dayjs from 'dayjs'

const StaffHeader = () => {
    const [currentTime, setCurrentTime] = useState(dayjs());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(dayjs());
        }, 1000);
        return () => clearInterval(interval);
    }, []);
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <img src={logo4} alt='restro logo' style={{ width: 48, height: 48, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} />
                <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, letterSpacing: 1, color: '#dc3545' }}>Harbor Staff</h1>
            </div>
            {/* Time */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FaBell style={{ color: '#dc3545', fontSize: 22, marginRight: 8 }} />
                <span style={{ fontSize: 22, fontWeight: 600, color: '#333', letterSpacing: 1, minWidth: 100, textAlign: 'center' }}>{currentTime?.format('HH:mm:ss')}</span>
            </div>
            {/* LOGGED USER DETAIL */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <FaUserCircle style={{ fontSize: 36, color: '#dc3545' }} />
                <div style={{ lineHeight: 1.1 }}>
                    <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0, color: '#222' }}>Staff Member</h2>
                    <p style={{ fontSize: 14, color: '#888', margin: 0 }}>Staff</p>
                </div>
            </div>
        </div>
    )
}

export default StaffHeader 