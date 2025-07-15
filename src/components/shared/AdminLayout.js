import Header from './AdminHeader';
import BottomNav from './AdminBottomNav';
import { Outlet } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

const AdminLayout = () => {
  return (
    <>
      <Header />
      <PrivateRoute >
        <Outlet />
      </PrivateRoute>
      <div className='my-5'></div>
      <BottomNav />
    </>
  );
};

export default AdminLayout;
