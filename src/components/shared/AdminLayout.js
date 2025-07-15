import Header from './AdminHeader';
import BottomNav from './AdminBottomNav';
import { Outlet } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import { UserContext, UserProvider } from './UserContext';

const AdminLayout = () => {
  return (
    <UserProvider>
      <Header />
      <PrivateRoute >
        <Outlet />
      </PrivateRoute>
      <div className='my-5'></div>
      <BottomNav />
    </UserProvider>
  );
};

export default AdminLayout;
