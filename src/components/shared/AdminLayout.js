import Header from './AdminHeader';
import BottomNav from './AdminBottomNav';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <div className='my-5'></div>
      <BottomNav />
    </>
  );
};

export default AdminLayout;
