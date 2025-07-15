import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Orders from './pages/Orders';
import Home from './pages/Home';
import ClientLayout from './components/shared/ClientLayout';
import AdminLayout from './components/shared/AdminLayout';
import Employees from './pages/Admin/Employees';

import CreateBill from './bill/CreateBill';
import PayWithQR from './bill/PayWithQr';



import Menu from './pages/Admin/Menu';
import BookMenu from './pages/BookMenu';
import RegisterPage from './pages/Register';
import { ToastContainer } from 'react-toastify';
import DashboardRevenue from './pages/Admin/Dashboard/Dashboard';
import StaffLayout from './components/shared/StaffLayout';
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route element={<ClientLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/login" element={<Login />} />
            <Route path="/create-bill" element={<CreateBill />} />
          <Route path="/bills/:id" element={<PayWithQR />} />
            <Route path="/register" element={<RegisterPage />} />
            {/* Đặt bàn */}
            <Route path="/book" element={<div>hello</div>} />
            <Route path="/order-menu" element={<BookMenu />} />
            
            {/* <Route path="/menu" element={<div>Menu Page</div>} /> */}
          </Route>

          {/* Layout riêng cho admin */}
          <Route path="/staff" element={<StaffLayout />}>
            {/* quản lý nhân viên */}
            <Route path="employees" element={<Employees />} />

            {/* thống kê */}
            

            {/* đặt bàn */}
            {/* <Route path="orders" element={<Orders />} /> */}

            {/* kho  */}
            {/* <Route path="inventory" element={<div>Inventory Page</div>} /> */}

            {/* menu  */}
            <Route path="menu" element={<Menu />} />
          </Route>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<DashboardRevenue />} />
          </Route>
        </Routes>
        
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
