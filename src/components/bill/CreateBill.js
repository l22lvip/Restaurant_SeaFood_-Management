import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Form,
  Button,
  Table,
  Row,
  Col,
  Card,
  Badge
} from 'react-bootstrap';
import './css/CreateBill.css';
import axios from 'axios';

const CreateBill = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [bills, setBills] = useState([]);
  const [tables, setTables] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [amount, setAmount] = useState('');
  const [orders, setOrders] = useState([]);
  const [description, setDescription] = useState('');
  const [tableId, setTableId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [maxId, setId] = useState(0);
  const [update, setUpdate] = useState(false);
  // Nhận thông tin order từ location.state nếu có
  const orderInfo = location.state?.order;
  // State cho phân trang hóa đơn
  const [currentPage, setCurrentPage] = useState(1);
  const billsPerPage = 5;

  useEffect(() => {
    fetch('http://localhost:9999/bills')
      .then((res) => res.json())
      .then((data) => setBills(data));

    fetch('http://localhost:9999/tables')
      .then((res) => res.json())
      .then((data) => setTables(data));

    fetch('http://localhost:9999/customers')
      .then((res) => res.json())
      .then((data) => setCustomers(data));

    fetch('http://localhost:9999/orders')
      .then((res) => res.json())
      .then((data) => setOrders(data));

    axios.get('http://localhost:9999/bills')
      .then((res) => {
        res.data.forEach((bill) => {
          if (bill.id > maxId) {
            setId(bill.id);
          }
        });
      });
  }, [maxId, update]);

  const handleCreateBill = async () => {


    const order = orders.find(o => String(o.tableId) === String(tableId));
    if (!order) {
      alert('Không tìm thấy đơn hàng cho bàn này!');
      return;
    }

    const newBill = {
      id: maxId + 1,
      orderId: order.id,
      tableId: order.tableId,
      total: order.total,
      paymentMethod,
      status: 'Pending',
      timestamp: new Date().toISOString()
    };

    try {
      const res = await axios.post('http://localhost:9999/bills', newBill);
      if (res && res.status === 201) {
        setUpdate((prev) => !prev);
        setAmount('');
        setDescription('');
        setTableId('');
        setPaymentMethod('Cash');
        setId(newBill.id);
        alert('Tạo hóa đơn thành công!');
      } else {
        alert('Tạo hóa đơn thất bại!');
      }
    } catch (error) {
      alert('Lỗi khi tạo hóa đơn!');
    }
  };

  const getTableName = (id) => {
    const table = tables.find((t) => t.id == id);
    return table ? `Bàn ${table.id}` : `Bàn ${id}`;
  };

  const renderStatus = (status) => {
    switch (status) {
      case 'Completed':
        return <Badge bg="success">Đã thanh toán</Badge>;
      case 'In Progress':
        return <Badge bg="warning">Đang xử lý</Badge>;

    }
  };

  return (
    <Container className="bill-manager-container">
      <Card className="bill-form-card">
          <Card.Body>
            
          <Row>
            <h4 className="form-title">Thông tin hóa đơn</h4>
            <Col md={12}>
              <Form.Group>
                <Form.Label>Khách hàng</Form.Label>
                {orderInfo ? (
                  (() => {
                    const customer = customers.find(c => String(c.id) === String(orderInfo.userId));
                    return customer ? (
                      <div className="customer-info-box">
                        <div><b>Tên:</b> {customer.name}</div>
                        <div><b>Email:</b> {customer.email || '---'}</div>
                        <div><b>SĐT:</b> {customer.phone || '---'}</div>
                      </div>
                    ) : <div className="text-muted">Không có thông tin khách hàng</div>;
                  })()
                ) : customers.length > 0 ? (
                  <div className="customer-info-box">
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
                <Form.Label>Tổng số tiền</Form.Label>
                <Form.Control
                  type="number"
                  value={orderInfo ? orderInfo.total : (() => {
                    const order = orders.find(o => String(o.tableId) === String(tableId));
                    return order ? order.total : '';
                  })()}
                  readOnly
                  placeholder="Tự động lấy từ đơn hàng"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Bàn</Form.Label>
                <Form.Select value={orderInfo ? orderInfo.tableId : tableId} onChange={(e) => setTableId(e.target.value)} disabled={!!orderInfo}>
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
                <div className="qr-section">
                  <img
                    src={require('../../assets/images/qr.png')}
                    alt="QR code demo"
                    className="qr-image"
                  />
                  <div className="qr-note">Quét mã QR để thanh toán</div>
                </div>
              )}
            </Col>

            <Button variant="primary" className="mt-4 w-100" onClick={handleCreateBill}>
              Tạo hóa đơn
            </Button>
          </Row>

          <Row>
            <h4 className="mb-3 text-secondary">Danh sách sản phẩm đã đặt</h4>
          {(orderInfo ? orderInfo.tableId : tableId) ? (
            (() => {
              const selectedOrder = orderInfo ? orderInfo : orders.find(o => String(o.tableId) === String(tableId));
              if (!selectedOrder || !selectedOrder.items?.length) {
                return <div className="text-muted">Không có sản phẩm nào.</div>;
              }

              return (
                <>
                  <Table striped bordered hover>
                    <thead className="table-light">
                      <tr>
                        <th>#</th>
                        <th>Sản phẩm</th>
                        <th>Số lượng</th>
                        <th>Đơn giá</th>
                        <th>Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item.name || item.productName}</td>
                          <td>{item.quantity}</td>
                          <td>{item.price.toLocaleString()} đ</td>
                          <td>{(item.price * item.quantity).toLocaleString()} đ</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  <h5 className="text-end mt-3">
                    Tổng cộng:{' '}
                    <span className="text-primary fw-bold">
                      {selectedOrder.total.toLocaleString()} đ
                    </span>
                  </h5>
                </>
              );
            })()
          ) : (
            <div className="text-muted">Vui lòng chọn bàn để xem đơn hàng.</div>
          )}
          </Row>
          </Card.Body>
      </Card>

      {/* Danh sách hóa đơn với phân trang */}
      <Card className="shadow-sm mt-4 bill-card">
        <Card.Body>
          <Row>
            <Col>
              <h5 className="mb-3">Danh sách hóa đơn</h5>
              {orders.length ? (
                <>
                  <Table striped bordered hover>
                    <thead className="table-light">
                      <tr>
                        <th>#</th>
                        <th>Bàn</th>
                        <th>Tổng tiền</th>
                        <th>Trạng thái</th>
                        <th>Thời gian</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders
                        .slice((currentPage - 1) * billsPerPage, currentPage * billsPerPage)
                        .map((order, index) => (
                          <tr key={order.id}>
                            <td>{(currentPage - 1) * billsPerPage + index + 1}</td>
                            <td>{getTableName(order.tableId)}</td>
                            <td>{order.total.toLocaleString()} đ</td>
                            <td>{renderStatus(order.status)}</td>
                            <td>{new Date(order.timestamp).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ' ' + new Date(order.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                  {/* Pagination controls */}
                  <div className="d-flex justify-content-center align-items-center mt-3">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      Trang trước
                    </Button>
                    <span>Trang {currentPage} / {Math.ceil(orders.length / billsPerPage)}</span>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="ms-2"
                      disabled={currentPage === Math.ceil(orders.length / billsPerPage) || orders.length === 0}
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      Trang sau
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-muted">Không có hóa đơn nào.</div>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CreateBill;