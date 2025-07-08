import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home, Auth, Orders } from './pages';
import Header from './components/shared/Header';
import BottomNav from './components/shared/BottomNav';
import EmployeeManagement from './pages/EmployeeManagement';
function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/employees" element={<EmployeeManagement />} />
        </Routes>
        <BottomNav />
      </Router>
    </>
  );
}

export default App;
