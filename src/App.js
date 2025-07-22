import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Home, Auth, Orders, Tables, EmployeeList, CreateEmployee, EditEmployee, FinancialDashboard, AddFoodImport, OrderManagement, Menu, MenuManagementCreate, MenuManagementEdit } from './pages';
import Header from './components/shared/Header';
import BottomNav from './components/shared/BottomNav';
import CreateBill from './components/bill/CreateBill';
const PrivateRoute = ({ children, role }) => {
  const data = localStorage.getItem('user');
  const user = JSON.parse(data);
  console.log("user", user)
  if (!user) {
    return <Navigate to="/auth" />;
  }
  if (user?.role !== role) {
    return <Navigate to="/auth" />;
  }
  return children;
};
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
        <Route path="/completed-orders" element={<OrderManagement />} />

        <Route path="/admin">
          <Route path="employees" element={<PrivateRoute role="admin"><EmployeeList /></PrivateRoute>} />
          <Route path="employees/create" element={<PrivateRoute role="admin"><CreateEmployee /></PrivateRoute>} />
          <Route path="employees/edit/:id" element={<PrivateRoute role="admin"><EditEmployee /></PrivateRoute>} />
          <Route path="financial" element={<PrivateRoute role="admin"><FinancialDashboard /></PrivateRoute>} />
          <Route path="add-food-import" element={<PrivateRoute role="admin"><AddFoodImport /></PrivateRoute>} />
          <Route path="menu-management" element={<PrivateRoute role="admin"><Menu /></PrivateRoute>} />
          <Route path="menu-management/create" element={<PrivateRoute role="admin"><MenuManagementCreate /></PrivateRoute>} />
          <Route path="menu-management/edit/:id" element={<PrivateRoute role="admin"><MenuManagementEdit /></PrivateRoute>} />
          <Route path="add-operational-expense" element={<PrivateRoute role="admin"><AddFoodImport /></PrivateRoute>} />
        </Route>
      </Routes>
        <div style={{ margin: '15rem' }}></div>
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
