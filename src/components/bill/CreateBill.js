import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Form, Button, Table, Row, Col, Card, Badge, FormGroup, CardBody } from 'react-bootstrap';
import './css/CreateBill.css';
import axios from 'axios';


const CreateBill = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [tables, setTables] = useState([]);
  const [amount, setAmount] = useState('');
  const [orders, setOrders] = useState([]);
  const [tableId, setTableId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [maxId, setId] = useState(0);
  const [update, setUpdate] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [bills, setBills] = useState([]);
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);

  const orderInfo = location.state?.order;
  const billsPerPage = 5;
  const data = localStorage.getItem('user');
  const user = JSON.parse(data);

  useEffect(() => {
    fetch('http://localhost:9999/tables')
      .then((res) => res.json())
      .then((data) => setTables(data));

    fetch('http://localhost:9999/bills')
      .then((res) => res.json())
      .then((data) => setBills(data));

    fetch('http://localhost:9999/orders')
      .then((res) => res.json())
      .then((data) => setOrders(data));

    axios.get('http://localhost:9999/bills')
      .then((res) => {
        res.data.forEach((bill) => {
          const billIdNum = Number(bill.id);
          if (!isNaN(billIdNum) && billIdNum > maxId) {
            setId(billIdNum);
          }
        });
      });
  }, [maxId, update]);

  useEffect(() => {
    const selected = orderInfo
      ? orderInfo
      : orders.find((o) => String(o.tableId) === String(tableId));
    if (selected && selected.items?.length) {
      setIsPaymentSuccessful(true);
    }
  }, [orderInfo, orders, tableId]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!isPaymentSuccessful) {
        event.preventDefault();
        event.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isPaymentSuccessful]);
  const validateCustomerInfo = () => {
    if (!customerName.trim() || customerName.trim().length < 2 || !/^[\p{L}\s]+$/u.test(customerName.trim())) {
      alert('Vui lòng nhập tên khách hàng hợp lệ (chỉ chữ, tối thiểu 2 ký tự).');
      return false;
    }
    if (
      customerPhone.trim() &&
      !/^0\d{8,10}$/.test(customerPhone.trim())
    ) {
      alert('Vui lòng nhập số điện thoại hợp lệ (bắt đầu bằng 0, 9-11 số).');
      return false;
    }
    return true;
  };
  const handleCreateBill = async () => {
    console.log('tableId đang chọn:', tableId);
    console.log('bills hiện tại:', bills);

    const selectedOrder = orderInfo
      ? orderInfo
      : orders.find((o) => String(o.tableId) === String(tableId));
    if (!selectedOrder || !selectedOrder.items?.length) {
      alert('Không có sản phẩm nào cho bàn này!');
      return;
    }

    if (!validateCustomerInfo()) return;
    const newBill = {
      id: String(Number(maxId) + 1),
      orderId: selectedOrder.id,
      userId: user.id,
      tableId: selectedOrder.tableId,
      total: selectedOrder.total,
      paymentMethod,
      status: 'Pending',
      timestamp: new Date().toISOString(),
      customerName,
      customerPhone,
    };

    try {
      const res = await axios.post('http://localhost:9999/bills', newBill);

      if (res && res.status === 201) {
        setUpdate((prev) => !prev);
        setAmount('');
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

    console.log('Tạo hóa đơn:', newBill);
  };

  const getTableName = (id) => {
    const table = tables.find((t) => t.id == id);
    return table ? `Bàn ${table.id}` : `Bàn ${id}`;
  };

  const renderStatus = (status) => {
    switch (status) {
      case 'Paid':
        return <Badge bg="success">Đã thanh toán</Badge>;
      case 'Pending':
        return <Badge bg="warning">Đang xử lý</Badge>;
      default:
        return null;
    }
  };

  const handleMarkAsPaid = async () => {
    const selectedOrder =
      orderInfo || orders.find((o) => String(o.tableId) === String(tableId));
    if (!selectedOrder?.items?.length)
      return alert('Không có sản phẩm nào cho bàn này!');

    const updatedOrder = { ...selectedOrder, status: 'Completed' };
    const billToUpdate = bills.find(
      (b) => String(b.orderId) === String(selectedOrder.id)
    );
    if (!billToUpdate) return alert('Không tìm thấy hóa đơn!');

    const updatedBill = { ...billToUpdate, status: 'Paid' };
    try {
      await axios.put(
        `http://localhost:9999/orders/${selectedOrder.id}`,
        updatedOrder
      );
      await axios.put(
        `http://localhost:9999/bills/${String(billToUpdate.id)}`,
        updatedBill
      );
      await axios.put(
        `http://localhost:9999/tables/${selectedOrder.tableId}`,
        {
          ...tables.find((t) => t.id === selectedOrder.tableId),
          status: 'empty',
        }
      );
      alert('Thanh toán thành công!');
      navigate('/tables');
    } catch {
      alert('Lỗi khi cập nhật trạng thái!');
    }
  };

  const handleBack = () => {
    if (isPaymentSuccessful) {
      if (window.confirm('Bạn có muốn hủy phiên thanh toán không?')) {
        navigate('/tables');
      }
    } else {
      navigate('/tables');
    }
  };

  return (
    <Container fluid className='bill-manager-container'>
      <Card className="bill-form-card">
        <Row style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          {/* Cột bên trái: Thông tin hóa đơn */}
          <Col md={6}>
            <h4 className="form-title text-info">Thông tin hóa đơn</h4>
            {/* <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>Khách hàng</div> */}
            <FormGroup>
              <span style={{ marginRight: '10px' }}> Tên khách hàng:</span>
              <Form.Control
                type="text"
                placeholder="Tên khách hàng"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="mb-2"
              />
            </FormGroup>
            <FormGroup>
              <span style={{ marginRight: '10px' }}> Số điện thoại:</span>
              <Form.Control
                type="tel"
                placeholder="Số điện thoại (nếu có)"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
              />
            </FormGroup>
            <Form.Group>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Form.Label>Bàn:</Form.Label>
                {orderInfo ? orderInfo.tableId : tableId}
              </div>
            </Form.Group>
            <Form.Group>
              <span style={{ marginRight: '10px' }}>Phương thức thanh toán:</span>
              <Form.Select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="Cash">Tiền mặt</option>
                <option value="QR">QR Code</option>
                <option value="Card">Thẻ</option>
              </Form.Select>
            </Form.Group>

            {paymentMethod === 'QR' && (
              <Card className="mt-3 text-center">
                <Card.Body>
                  <Card.Img
                    variant="top"
                    src={require('../../assets/images/qr.png')}
                    alt="QR code demo"
                    style={{ maxWidth: '150px', margin: '0 auto' }}
                  />
                  <Form.Text className="text-muted d-block mt-2">
                    Quét mã QR để thanh toán
                  </Form.Text>
                </Card.Body>
              </Card>
            )}

            <Button variant="primary" className="mt-4 w-100" style={{ marginRight: '10px' }} onClick={handleCreateBill}>
              Tạo hóa đơn
            </Button>
            <Button variant="success" className="mt-3 w-100" onClick={handleMarkAsPaid}>
              Thanh toán thành công
            </Button>
          </Col>

          {/* Cột bên phải: Danh sách sản phẩm */}
          <Col md={6}>
            <h4 className="mb-3 text-info">Danh sách sản phẩm đã đặt</h4>
            {(orderInfo ? orderInfo.tableId : tableId) ? (
              (() => {
                const selectedOrder = orderInfo
                  ? orderInfo
                  : orders.find((o) => String(o.tableId) === String(tableId));
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
                            <td>{item.name}</td>
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
          </Col>
        </Row>
      </Card>


      {/* Danh sách hóa đơn với phân trang */}
      <Card className="bill-form-card shadow-sm mt-4 bill-card ">
        <Card.Body>
          <Row>
            <Col>
              <h2 className="mb-3">Danh sách hóa đơn</h2>
              {orders.length ? (
                <>
                  <Table striped bordered hover>
                    <thead className="table-light">
                      <tr>
                        <th>#</th>
                        <th>Bàn</th>
                        <th>Khách hàng</th>
                        <th>Tổng tiền</th>
                        <th>Trạng thái</th>
                        <th>Thời gian</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bills
                        .slice(
                          (currentPage - 1) * billsPerPage,
                          currentPage * billsPerPage
                        )
                        .map((bill, index) => {
                          // Lấy thông tin đơn hàng
                          const order = orders.find(
                            (o) => o.id === bill.orderId
                          );
                          return (
                            <tr key={bill.id}>
                              <td>
                                {(currentPage - 1) * billsPerPage +
                                  index +
                                  1}
                              </td>
                              <td>{getTableName(bill.tableId)}</td>
                              <td>
                                <div>
                                  <strong>
                                    {bill.customerName || '---'}
                                  </strong>
                                </div>
                                <div
                                  className="text-muted"
                                  style={{ fontSize: '0.9em' }}
                                >
                                  {bill.customerPhone || '---'}
                                </div>
                              </td>
                              <td>
                                {bill.total?.toLocaleString() || '---'} đ
                              </td>
                              <td>{renderStatus(bill.status)}</td>
                              <td>
                                {new Date(
                                  bill.timestamp
                                ).toLocaleDateString('vi-VN', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                }) +
                                  ' ' +
                                  new Date(
                                    bill.timestamp
                                  ).toLocaleTimeString('vi-VN', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                              </td>
                            </tr>
                          );
                        })}
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
                    <span>
                      Trang {currentPage} /{' '}
                      {Math.ceil(bills.length / billsPerPage)}
                    </span>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="ms-2"
                      disabled={
                        currentPage ===
                        Math.ceil(bills.length / billsPerPage) ||
                        bills.length === 0
                      }
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