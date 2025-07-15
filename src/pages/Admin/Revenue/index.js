import React, { useEffect, useState } from 'react';
import {
  Container, Row, Col, Table, Button, Modal, Form, Card,
  Spinner, Nav, Tab
} from 'react-bootstrap';
import { 
  FaMoneyBillWave, FaChartLine, FaPiggyBank, FaPlus, FaTrash 
} from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import './revenue.css';

const API_URL = 'http://localhost:9999';

const RevenueManagement = () => {
  // State for different tabs
  const [activeTab, setActiveTab] = useState('importCosts');
  
  // Import costs state
  const [importCosts, setImportCosts] = useState([]);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFormData, setImportFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    description: '',
    supplier: ''
  });

  // Monthly data state
  const [monthlyData, setMonthlyData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  // Revenue data state
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all data
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchImportCosts(),
          fetchMonthlyData(),
          fetchRevenueData()
        ]);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Lỗi khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const fetchImportCosts = async () => {
    try {
      const response = await axios.get(`${API_URL}/importCosts`);
      setImportCosts(response.data || []);
    } catch (error) {
      console.error('Error fetching import costs:', error);
      // Fallback to empty array if API fails
      setImportCosts([]);
    }
  };

  const fetchMonthlyData = async () => {
    try {
      const response = await axios.get(`${API_URL}/monthlyRevenue`);
      setMonthlyData(response.data || []);
    } catch (error) {
      console.error('Error fetching monthly data:', error);
      // Fallback to empty array if API fails
      setMonthlyData([]);
    }
  };

  const fetchRevenueData = async () => {
    try {
      const response = await axios.get(`${API_URL}/dailyRevenues`);
      setRevenueData(response.data || []);
    } catch (error) {
      console.error('Error fetching revenue data:', error);
      // Fallback to empty array if API fails
      setRevenueData([]);
    }
  };

  // Handle import cost operations
  const handleAddImportCost = async () => {
    try {
      const newImportCost = {
        ...importFormData,
        id: Date.now(),
        amount: parseFloat(importFormData.amount)
      };
      
      // Try to post to API
      try {
        await axios.post(`${API_URL}/importCosts`, newImportCost);
      } catch (apiError) {
        // If API fails, just update local state
        console.log('API not available, updating local state:', apiError.message);
      }
      
      setImportCosts(prev => [newImportCost, ...prev]);
      setShowImportModal(false);
      setImportFormData({
        date: new Date().toISOString().split('T')[0],
        amount: '',
        description: '',
        supplier: ''
      });
      toast.success('Thêm chi phí nhập hàng thành công!');
    } catch (error) {
      console.error('Error adding import cost:', error);
      toast.error('Lỗi khi thêm chi phí nhập hàng');
    }
  };

  const handleDeleteImportCost = async (id) => {
    try {
      try {
        await axios.delete(`${API_URL}/importCosts/${id}`);
      } catch (apiError) {
        console.log('API not available, updating local state:', apiError.message);
      }
      
      setImportCosts(prev => prev.filter(item => item.id !== id));
      toast.success('Xóa chi phí nhập hàng thành công!');
    } catch (error) {
      console.error('Error deleting import cost:', error);
      toast.error('Lỗi khi xóa chi phí nhập hàng');
    }
  };

  // Calculate monthly interest rate
  const calculateMonthlyInterest = () => {
    const currentMonthData = monthlyData.find(
      data => data.month === selectedMonth && data.year === selectedYear
    );
    
    if (currentMonthData && currentMonthData.interestRate !== undefined) {
      return currentMonthData.interestRate;
    }
    
    // Calculate if not found
    const monthRevenue = revenueData
      .filter(item => {
        const itemDate = new Date(item.date);
        return itemDate.getMonth() + 1 === selectedMonth && itemDate.getFullYear() === selectedYear;
      })
      .reduce((sum, item) => sum + (item.profit || 0), 0);
    
    const monthExpenses = revenueData
      .filter(item => {
        const itemDate = new Date(item.date);
        return itemDate.getMonth() + 1 === selectedMonth && itemDate.getFullYear() === selectedYear;
      })
      .reduce((sum, item) => sum + (item.expenses || 0), 0);
    
    return monthExpenses > 0 ? ((monthRevenue / monthExpenses) * 100) : 0;
  };

  // Import Costs Tab Component
  const ImportCostsTab = () => (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="revenue-title">
          <FaMoneyBillWave className="me-2" />
          Quản lý chi phí nhập hàng
        </h4>
        <Button 
          className="add-revenue-btn"
          onClick={() => setShowImportModal(true)}
        >
          <FaPlus className="me-2" />
          Thêm chi phí nhập hàng
        </Button>
      </div>

      <Card className="revenue-card">
        <Card.Body>
          <Table className="revenue-table" hover responsive>
            <thead>
              <tr>
                <th>Ngày</th>
                <th>Số tiền (VND)</th>
                <th>Mô tả</th>
                <th>Nhà cung cấp</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {importCosts.map((cost) => (
                <tr key={cost.id}>
                  <td>{new Date(cost.date).toLocaleDateString('vi-VN')}</td>
                  <td className="text-danger fw-bold">
                    {(cost.amount || 0).toLocaleString()} VND
                  </td>
                  <td>{cost.description || 'N/A'}</td>
                  <td>{cost.supplier || 'N/A'}</td>
                  <td>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDeleteImportCost(cost.id)}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          
          <div className="revenue-summary mt-4">
            <Row>
              <Col md={4}>
                <Card className="summary-card">
                  <Card.Body className="text-center">
                    <h5>Tổng chi phí hôm nay</h5>
                    <h3 className="text-danger">
                      {importCosts
                        .filter(cost => cost.date === new Date().toISOString().split('T')[0])
                        .reduce((sum, cost) => sum + (cost.amount || 0), 0)
                        .toLocaleString()} VND
                    </h3>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="summary-card">
                  <Card.Body className="text-center">
                    <h5>Tổng chi phí tháng này</h5>
                    <h3 className="text-warning">
                      {importCosts
                        .filter(cost => {
                          const costDate = new Date(cost.date);
                          const now = new Date();
                          return costDate.getMonth() === now.getMonth() && 
                                 costDate.getFullYear() === now.getFullYear();
                        })
                        .reduce((sum, cost) => sum + (cost.amount || 0), 0)
                        .toLocaleString()} VND
                    </h3>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="summary-card">
                  <Card.Body className="text-center">
                    <h5>Số lần nhập hàng</h5>
                    <h3 className="text-info">
                      {importCosts.filter(cost => {
                        const costDate = new Date(cost.date);
                        const now = new Date();
                        return costDate.getMonth() === now.getMonth() && 
                               costDate.getFullYear() === now.getFullYear();
                      }).length}
                    </h3>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        </Card.Body>
      </Card>
    </div>
  );

  // Monthly Interest Tab Component
  const MonthlyInterestTab = () => (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="revenue-title">
          <FaChartLine className="me-2" />
          Lãi suất hàng tháng
        </h4>
        <div className="d-flex gap-3">
          <Form.Select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            style={{ width: '120px' }}
          >
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                Tháng {i + 1}
              </option>
            ))}
          </Form.Select>
          <Form.Select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            style={{ width: '100px' }}
          >
            <option value={2024}>2024</option>
            <option value={2025}>2025</option>
          </Form.Select>
        </div>
      </div>

      <Row className="mb-4">
        <Col md={4}>
          <Card className="interest-card">
            <Card.Body className="text-center">
              <FaChartLine size={48} className="text-success mb-3" />
              <h5>Lãi suất tháng {selectedMonth}/{selectedYear}</h5>
              <h2 className="text-success">
                {(calculateMonthlyInterest() || 0).toFixed(2)}%
              </h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <Card className="revenue-card">
            <Card.Body>
              <h5>Chi tiết lãi suất theo tháng</h5>
              <Table className="revenue-table" responsive>
                <thead>
                  <tr>
                    <th>Tháng/Năm</th>
                    <th>Doanh thu</th>
                    <th>Chi phí</th>
                    <th>Lợi nhuận</th>
                    <th>Lãi suất (%)</th>
                    <th>Đơn hàng</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyData.map((data) => (
                    <tr key={`${data.month}-${data.year}`}>
                      <td>{data.month}/{data.year}</td>
                      <td className="text-success">
                        {(data.totalRevenue || 0).toLocaleString()} VND
                      </td>
                      <td className="text-danger">
                        {(data.totalExpenses || 0).toLocaleString()} VND
                      </td>
                      <td className="text-primary">
                        {(data.profit || 0).toLocaleString()} VND
                      </td>
                      <td className="text-warning fw-bold">
                        {(data.interestRate || 0).toFixed(2)}%
                      </td>
                      <td>{data.orders || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );

  // Monthly Revenue Tab Component
  const MonthlyRevenueTab = () => (
    <div>
      <h4 className="revenue-title mb-4">
        <FaPiggyBank className="me-2" />
        Doanh thu hàng tháng
      </h4>

      <Row className="mb-4">
        <Col md={3}>
          <Card className="summary-card">
            <Card.Body className="text-center">
              <h6>Doanh thu hôm nay</h6>
              <h4 className="text-success">
                {revenueData.length > 0 ? 
                  (revenueData[0].totalSales || 0).toLocaleString() : 0} VND
              </h4>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="summary-card">
            <Card.Body className="text-center">
              <h6>Lợi nhuận hôm nay</h6>
              <h4 className="text-primary">
                {revenueData.length > 0 ? 
                  (revenueData[0].profit || 0).toLocaleString() : 0} VND
              </h4>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="summary-card">
            <Card.Body className="text-center">
              <h6>Đơn hàng hôm nay</h6>
              <h4 className="text-info">
                {revenueData.length > 0 ? (revenueData[0].totalOrders || 0) : 0}
              </h4>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="summary-card">
            <Card.Body className="text-center">
              <h6>Tỷ lệ lợi nhuận</h6>
              <h4 className="text-warning">
                {revenueData.length > 0 && revenueData[0].totalSales > 0 ? 
                  (((revenueData[0].profit || 0) / (revenueData[0].totalSales || 1)) * 100).toFixed(1) : 0}%
              </h4>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="revenue-card">
        <Card.Body>
          <h5>Chi tiết doanh thu theo ngày</h5>
          <Table className="revenue-table" hover responsive>
            <thead>
              <tr>
                <th>Ngày</th>
                <th>Doanh thu</th>
                <th>Chi phí</th>
                <th>Lợi nhuận</th>
                <th>Đơn hàng</th>
                <th>Món bán chạy</th>
                <th>Giờ cao điểm</th>
              </tr>
            </thead>
            <tbody>
              {revenueData.map((revenue) => (
                <tr key={revenue.date}>
                  <td>{new Date(revenue.date).toLocaleDateString('vi-VN')}</td>
                  <td className="text-success fw-bold">
                    {(revenue.totalSales || 0).toLocaleString()} VND
                  </td>
                  <td className="text-danger">
                    {(revenue.expenses || 0).toLocaleString()} VND
                  </td>
                  <td className="text-primary">
                    {(revenue.profit || 0).toLocaleString()} VND
                  </td>
                  <td>{revenue.totalOrders || 0}</td>
                  <td>
                    {revenue.topDishes ? revenue.topDishes.join(', ') : 'N/A'}
                  </td>
                  <td>
                    {revenue.peakHours ? revenue.peakHours.join(', ') : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <Container fluid className="revenue-container">
      <div className="revenue-header mb-4">
        <h2 className="revenue-main-title">
          <FaMoneyBillWave className="me-3" />
          Quản lý Doanh thu & Chi phí
        </h2>
      </div>

      <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
        <Nav variant="pills" className="revenue-nav mb-4">
          <Nav.Item>
            <Nav.Link eventKey="importCosts" className="revenue-nav-link">
              <FaMoneyBillWave className="me-2" />
              Chi phí nhập hàng
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="monthlyInterest" className="revenue-nav-link">
              <FaChartLine className="me-2" />
              Lãi suất hàng tháng
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="monthlyRevenue" className="revenue-nav-link">
              <FaPiggyBank className="me-2" />
              Doanh thu hàng tháng
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey="importCosts">
            <ImportCostsTab />
          </Tab.Pane>
          <Tab.Pane eventKey="monthlyInterest">
            <MonthlyInterestTab />
          </Tab.Pane>
          <Tab.Pane eventKey="monthlyRevenue">
            <MonthlyRevenueTab />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>

      {/* Add Import Cost Modal */}
      <Modal show={showImportModal} onHide={() => setShowImportModal(false)} size="lg">
        <Modal.Header closeButton className="revenue-modal-header">
          <Modal.Title>
            <FaPlus className="me-2" />
            Thêm chi phí nhập hàng
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="revenue-modal-body">
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Ngày nhập hàng</Form.Label>
                  <Form.Control
                    type="date"
                    value={importFormData.date}
                    onChange={(e) => setImportFormData({
                      ...importFormData,
                      date: e.target.value
                    })}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Số tiền (VND)</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Nhập số tiền"
                    value={importFormData.amount}
                    onChange={(e) => setImportFormData({
                      ...importFormData,
                      amount: e.target.value
                    })}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Mô tả</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Mô tả sản phẩm"
                    value={importFormData.description}
                    onChange={(e) => setImportFormData({
                      ...importFormData,
                      description: e.target.value
                    })}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nhà cung cấp</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Tên nhà cung cấp"
                    value={importFormData.supplier}
                    onChange={(e) => setImportFormData({
                      ...importFormData,
                      supplier: e.target.value
                    })}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer className="revenue-modal-footer">
          <Button variant="secondary" onClick={() => setShowImportModal(false)}>
            Hủy
          </Button>
          <Button 
            className="add-revenue-btn" 
            onClick={handleAddImportCost}
            disabled={!importFormData.amount || !importFormData.description}
          >
            <FaPlus className="me-2" />
            Thêm chi phí
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default RevenueManagement;
