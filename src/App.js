import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home, Auth, Orders, Tables, UserManagement, UserList, CreateUser, EditUser, OrderManagement } from './pages';
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
          <Route path="/users" element={<UserList />} />
          <Route path="/users/create" element={<CreateUser />} />
          <Route path="/users/edit/:id" element={<EditUser />} />
          <Route path="/completed-orders" element={<OrderManagement />} />
        </Routes>
        <BottomNav />
      </Router>
    </>
  );
}

export default App; 
