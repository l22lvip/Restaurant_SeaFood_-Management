import Header from './AdminHeader';
import BottomNav from './AdminBottomNav';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <BottomNav />
    </>
  );
};

export default AdminLayout;
