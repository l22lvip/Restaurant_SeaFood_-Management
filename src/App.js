import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Orders from './pages/Orders';
import Home from './pages/Home';
import ClientLayout from './components/shared/ClientLayout';
import AdminLayout from './components/shared/AdminLayout';
import Employees from './pages/Admin/Employees';
import Dashboard from './pages/Admin/Dashboard';
import Menu from './pages/Admin/Menu';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route element={<ClientLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/login" element={<Login />} />
            <Route path="/book" element={<div>Book a Table Page</div>} />
            <Route path="/menu" element={<div>Menu Page</div>} />
          </Route>

          {/* Layout riêng cho admin */}
          <Route path="/staff" element={<AdminLayout />}>
            {/* quản lý nhân viên */}
            <Route path="employees" element={<Employees />} />

            {/* thống kê */}
            <Route path="dashboard" element={<Dashboard />} />

            {/* đơn đã hoàn thành */}
            <Route path="/completed-orders" element={<OrderManagement />} />

            {/* đặt bàn */}
            {/* <Route path="orders" element={<Orders />} /> */}

            {/* kho  */}
            {/* <Route path="inventory" element={<div>Inventory Page</div>} /> */}

            {/* menu  */}
            <Route path="menu" element={<Menu />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
