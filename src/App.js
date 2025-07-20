import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home, Auth, Orders, Tables, UserManagement, EmployeeList, CreateEmployee, EditEmployee } from './pages';
import Header from './components/shared/Header';
import BottomNav from './components/shared/BottomNav';
import CreateBill from './components/bill/CreateBill';

function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/tables" element={<Tables />} />
          <Route path="/create-bill" element={<CreateBill />} />
          <Route path="/admin/employees" element={<EmployeeList />} />
          <Route path="/admin/employees/create" element={<CreateEmployee />} />
          <Route path="/admin/employees/edit/:id" element={<EditEmployee />} />
        </Routes>
        <BottomNav />
      </Router>
    </>
  );
}

export default App; 
