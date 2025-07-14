import Header from './Header';
import BottomNav from './BottomNav';
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
