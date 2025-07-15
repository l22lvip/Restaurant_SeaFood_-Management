import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import data from '../data/db.json';
import {
  Container,
  Form,
  Button,
  Table,
  Row,
  Col,
  Card,
  Badge,
} from 'react-bootstrap';
import './css/Bill.css';
import axios from 'axios';

const CreateBill = () => {
  const navigate = useNavigate();
  const [bills, setBills] = useState([]);
  const [tables, setTables] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [tableId, setTableId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  
  const [maxId, setId] = useState(0);
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    // Fetch bills
    fetch('http://localhost:9999/bills')
      .then((res) => res.json())
      .then((data) => setBills(data));
    // Fetch tables
    fetch('http://localhost:9999/tables')
      .then((res) => res.json())
      .then((data) => setTables(data));
    // Fetch customers
    fetch('http://localhost:9999/customers')
      .then((res) => res.json())
      .then((data) => setCustomers(data));
    axios.get('http://localhost:9999/bills')
      .then((res) => {
        res.data.forEach((bill) => {
          if (bill.id > maxId) {
            setId(bill.id);
          }
        })
      });
  }, [maxId, update]);

  const handleCreateBill = async () => {
    // Validate số tiền
    if (!amount || isNaN(amount) || parseInt(amount) <= 0) {
      alert('Số tiền phải là số lớn hơn 0!');
      return;
    }
    // Validate mô tả
    if (!description.trim()) {
      alert('Vui lòng nhập mô tả hóa đơn!');
      return;
    }
    // Validate chọn bàn
    if (!tableId) {
      alert('Vui lòng chọn bàn!');
      return;
    }

    const newBill = {
      id: maxId + 1,
      orderId: null,
      tableId: parseInt(tableId),
      total: parseInt(amount),
      paymentMethod,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      paidAt: new Date().toISOString(),
    };
    try {
      const res = await axios.post('http://localhost:9999/bills', newBill);
      if (res && res.status === 201) {
        setUpdate((prev) => !prev);
        setAmount('');
        setDescription('');
        setTableId('');
        setPaymentMethod('Cash');
        setId(newBill.id); // cập nhật maxId mới
        alert('Tạo hóa đơn thành công!');
      } else {
        alert('Tạo hóa đơn thất bại!');
      }
    } catch (error) {
      alert('Lỗi khi tạo hóa đơn!');
    }
  };

  const getTableName = (id) => {
    const table = tables.find((t) => t.id === id);
    return table ? `Bàn ${table.id}` : `Bàn ${id}`;
  };

  const renderStatus = (status) => {
    switch (status) {
      case 'Paid':
        return <Badge bg="success">Đã thanh toán</Badge>;
      case 'Pending':
        return <Badge bg="warning">Chờ xử lý</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  return (
    <Container className="py-4 bill-manager-container">
      {/* Thông tin hóa đơn dạng login box */}
      <div className="bill-form-wrapper">
        <Card className="bill-form-card">
          <Card.Body>
            <h4 className="form-title">Thông tin hóa đơn</h4>
            <Row className="g-3 bill-form-row">
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Khách hàng</Form.Label>
                  {/* Hiển thị thông tin khách hàng đầu tiên */}
                  {customers.length > 0 ? (
                    <div style={{ marginTop: 8, background: '#f8fafc', borderRadius: 8, padding: 10, fontSize: 15, color: '#1a3c5a' }}>
                      <div><b>Tên:</b> {customers[0].name}</div>
                      <div><b>Email:</b> {customers[0].email || '---'}</div>
                      <div><b>SĐT:</b> {customers[0].phone || '---'}</div>
                    </div>
                  ) : (
                    <div className="text-muted">Không có thông tin khách hàng</div>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Số tiền</Form.Label>
                  <Form.Control
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Nhập số tiền"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Mô tả</Form.Label>
                  <Form.Control
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Mô tả hóa đơn"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Bàn</Form.Label>
                  <Form.Select value={tableId} onChange={(e) => setTableId(e.target.value)}>
                    <option value="">Chọn bàn</option>
                    {tables.map((table) => (
                      <option key={table.id} value={table.id}>
                        {getTableName(table.id)}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Phương thức thanh toán</Form.Label>
                  <Form.Select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                    <option value="Cash">Tiền mặt</option>
                    <option value="QR">QR Code</option>
                    <option value="Card">Thẻ</option>
                  </Form.Select>
                </Form.Group>
                {paymentMethod === 'QR' && (
                  <div style={{marginTop: 16, textAlign: 'center'}}>
                    <img
                      src={require('../assets/images/qr.png')}
                      alt="QR code demo"
                      style={{ width: 180, height: 180, borderRadius: 16, boxShadow: '0 4px 16px rgba(0,0,0,0.10)', border: '2px solid #e3e3e3', background: '#fff', objectFit: 'cover', display: 'inline-block' }}
                    />
                    <div style={{fontSize: 14, color: '#888', marginTop: 8}}>Quét mã QR để thanh toán</div>
                  </div>
                )}
              </Col>
            </Row>
            <Button variant="primary" className="mt-4 w-100" onClick={handleCreateBill}>
              Tạo hóa đơn
            </Button>
          </Card.Body>
        </Card>
      </div>

      {/* Danh sách hóa đơn */}
      <Card className="shadow-sm mt-4 bill-card">
        <Card.Body>
          <h4 className="mb-3 text-secondary">Danh sách hóa đơn</h4>
          <Table striped hover responsive className="align-middle">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Bàn</th>
                <th className="text-end">Tổng tiền</th>
                <th>Phương thức</th>
                <th>Trạng thái</th>
                <th>Thời gian</th>
              </tr>
            </thead>
            <tbody className="table-light text-center">
              {bills.map((bill) => (
                <tr key={bill.id}>
                  <td>{bill.id}</td>
                  <td>{getTableName(bill.tableId)}</td>
                  <td className="text-end">
                    {bill.total.toLocaleString()} đ
                  </td>
                  <td>{bill.paymentMethod}</td>
                  <td>{renderStatus(bill.status)}</td>
                  <td>{new Date(bill.createdAt).toLocaleString('vi-VN')}</td>
                </tr>
              ))}
              {bills.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center text-muted py-3">
                    Không có hóa đơn nào.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CreateBill;
