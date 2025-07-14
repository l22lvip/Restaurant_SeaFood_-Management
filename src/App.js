import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/shared/AdminHeader';
import BottomNav from './components/shared/AdminBottomNav';
import EmployeeManagement from './pages/Admin/Employees';
import Login from './pages/Login';
import Orders from './pages/Orders';
import Home from './pages/Home';
import ClientLayout from './components/shared/ClientLayout';
import AdminLayout from './components/shared/AdminLayout';
import Employees from './pages/Admin/Employees';
import Register from './pages/Register';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route element={<ClientLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/book" element={<div>Book a Table Page</div>} />
            <Route path="/menu" element={<div>Menu Page</div>} />
          </Route>

          {/* Layout riêng cho admin */}
          <Route path="/admin" element={<AdminLayout />}>
            {/* quản lý nhân viên */}
            <Route path="employees" element={<Employees />} />
            
            {/* thống kê */}
            {/* <Route path="dashboard" element={<Dashboard />} /> */}
            
            {/* đặt bàn */}
            {/* <Route path="orders" element={<Orders />} /> */}

            {/* kho  */}
            {/* <Route path="inventory" element={<div>Inventory Page</div>} /> */}
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
