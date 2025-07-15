import Header from './AdminHeader';
import BottomNav from './AdminBottomNav';
import { Outlet } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import { UserContext, UserProvider } from './UserContext';

//  const AdminLayout = () => {
//   return (

import logo4 from '../../assets/images/logo4-done.png';

const AdminLayout = () => {
  return (
    <UserProvider>

      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #ffe5e5 100%)',
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
          boxShadow: '0 8px 32px rgba(220,53,69,0.12)',
          backdropFilter: 'blur(8px)',
          margin: '0 auto',
          padding: '2rem 1.5rem 1rem 1.5rem',
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <Header />
          <PrivateRoute >
            <Outlet />
          </PrivateRoute>
          <div className='my-5' style={{ margin: '100px' }}></div>
        </div>
          <BottomNav />
      </div>
    </UserProvider>
  );
};

export default AdminLayout;
