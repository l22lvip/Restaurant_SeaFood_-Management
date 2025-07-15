// components/AdminLayout.js
import { Outlet } from 'react-router-dom';
import ClientHeader from './ClientHeader';

const ClientLayout = () => {
  return (
    <>
      {/* Navigation */}
      <ClientHeader />
      <div className="mt-5">
        <Outlet />
      </div>
    </>
  );
};

export default ClientLayout;
