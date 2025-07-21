import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Home, Auth, Orders, Tables, EmployeeList, CreateEmployee, EditEmployee, FinancialDashboard, AddFoodImport, OrderManagement, Menu, MenuManagementCreate } from './pages';
import Header from './components/shared/Header';
import BottomNav from './components/shared/BottomNav';
import CreateBill from './components/bill/CreateBill';

function AppContent() {
  const location = useLocation();
  const hideNav = location.pathname === '/auth';
  return (
    <>
      {!hideNav && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/tables" element={<Tables />} />
        <Route path="/create-bill" element={<CreateBill />} />
        <Route path="/users" element={<EmployeeList />} />
        <Route path="/users/create" element={<CreateEmployee />} />
        <Route path="/users/edit/:id" element={<EditEmployee />} />
        <Route path="/admin/employees" element={<EmployeeList />} />
        <Route path="/admin/employees/create" element={<CreateEmployee />} />
        <Route path="/admin/employees/edit/:id" element={<EditEmployee />} />
        <Route path="/admin/financial" element={<FinancialDashboard />} />
        <Route path="/admin/add-food-import" element={<AddFoodImport />} />
        <Route path="/admin/orders" element={<OrderManagement />} />
        <Route path="/admin/menu-management" element={<Menu />} />
        <Route path="/admin/menu-management/create" element={<MenuManagementCreate />} />
      </Routes>
      {!hideNav && <BottomNav />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App; 
