import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/shared/Header';
import BottomNav from './components/shared/BottomNav';
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
          </Route>

          {/* Layout riêng cho admin */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="employees" element={<Employees />} />
            {/* <Route path="dashboard" element={<Dashboard />} /> */}
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
