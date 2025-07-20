import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Home, Auth, Orders, Tables, UserManagement, UserList, CreateUser, EditUser, Admin } from './pages';
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
        <Route path="/users" element={<UserList />} />
        <Route path="/users/create" element={<CreateUser />} />
        <Route path="/users/edit/:id" element={<EditUser />} />
        <Route path="/admin" element={<Admin />} />
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
