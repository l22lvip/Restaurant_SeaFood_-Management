import StaffHeader from './StaffHeader';
import StaffBottomNav from './StaffBottomNav';
import { Outlet } from 'react-router-dom';
import logo4 from '../../assets/images/logo4-done.png';
import { UserProvider } from './UserContext';
import PrivateRoute from './PrivateRoute';

const StaffLayout = () => {
  return (
    <UserProvider>

      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e5f7ff 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}>
        <div style={{ textAlign: 'center', marginTop: 32, marginBottom: 8 }}>
          <img src={logo4} alt="Logo" style={{ width: 64, height: 64, objectFit: 'contain', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }} />
        </div>
        <div style={{
          width: '100%',
          maxWidth: 1200,
          background: 'rgba(255,255,255,0.85)',
          borderRadius: 24,
          boxShadow: '0 8px 32px rgba(33,150,243,0.12)',
          backdropFilter: 'blur(8px)',
          margin: '0 auto',
          padding: '2rem 1.5rem 1rem 1.5rem',
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <StaffHeader />
          <PrivateRoute >
            <Outlet />
          </PrivateRoute>
          {/*
            <Outlet />
            <div className='my-5'></div>
          <BottomNav />
        </UserProvider> */}
          <div className='my-5' style={{ margin: '100px' }}></div>
        </div>
        <StaffBottomNav />
      </div>
    </UserProvider>
  );
};

export default StaffLayout; 