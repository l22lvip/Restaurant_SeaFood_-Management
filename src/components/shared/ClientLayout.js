// components/AdminLayout.js
import { Outlet } from 'react-router-dom';
import ClientHeader from './ClientHeader';

const ClientLayout = () => {
  return (
    <>
       {/* Navigation */}
      <ClientHeader></ClientHeader>
      <Outlet />
    </>
  );
};

export default ClientLayout;
