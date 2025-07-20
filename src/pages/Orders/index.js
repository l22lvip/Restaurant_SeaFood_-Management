import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Table, Form, Badge, Card, Modal, FormGroup } from "react-bootstrap";
import { } from "react-router-dom";
import axios from 'axios';
import './orders.css';
import html2pdf from 'html2pdf.js';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [bills, setBills] = useState([]);
  const [users, setUsers] = useState([]);
  const [menu, setMenu] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [selectedStaff, setSelectedStaff] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [dayOption, setDayOption] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    axios.get("http://localhost:9999/orders")
      .then(result => setOrders(result.data))
      .catch(error => console.error(error))
  }, [])

  useEffect(() => {
    axios.get("http://localhost:9999/bills")
      .then(result => {
        const paidBills = result.data.filter(bill => bill.status === "Paid");
        setBills(paidBills);
      })
      .catch(error => console.error(error))
  }, [])

  useEffect(() => {
    axios.get("http://localhost:9999/users")
      .then(result => setUsers(result.data))
      .catch(error => console.error(error))
  }, [])

  useEffect(() => {
    axios.get("http://localhost:9999/menuItems")
      .then(result => setMenu(result.data))
      .catch(error => console.error(error))
  }, [])

  const handleView = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const getToday = () => new Date().toISOString().slice(0, 10);

  const handleDayOption = (value) => {
    setDayOption(value);
    const today = new Date();
    let from = "", to = "";

    switch (value) {
      case "today":
        from = to = getToday();
        break;

      case "yesterday":
        const y = new Date(today);
        y.setDate(y.getDate() - 1);
        from = to = y.toISOString().slice(0, 10);
        break;

      case "thisWeek":
        const startOfWeek = new Date(today);
        const day = today.getDay() || 7;      // sun (0) -> 7
        startOfWeek.setDate(today.getDate() - day + 1);
        from = startOfWeek.toISOString().slice(0, 10);
        to = getToday();
        break;

      case "thisMonth":
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        from = startOfMonth.toISOString().slice(0, 10);
        to = getToday();
        break;

      default:
        break;
    }

    setFromDate(from);
    setToDate(to);
  };

  const filteredAndSortedBills = () => {
    let result = [...bills];

    // Search
    if (searchText.trim() !== "") {
      const lowerSearch = searchText.toLowerCase();

      result = result.filter(bill => {
        const userName = users.find(u => u.id == bill.userId)?.name?.toLowerCase() || "";
        const order = orders.find(o => o.id == bill.orderId);
        const customerName = bill?.customerName.toLowerCase() || "";
        const customerPhone = bill?.customerPhone || "";
        const total = String(bill?.total || "");

        const menuItemNames = order?.items.map(item => {
          const menuItem = menu.find(m => m.id == item.menuItemId);
          return menuItem?.name?.toLowerCase() || "";
        }) || [];

        const orderTime = new Date(bill.timestamp).toLocaleString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });

        return (
          userName.includes(lowerSearch) ||
          orderTime.includes(lowerSearch) ||
          customerName.includes(lowerSearch) ||
          customerPhone.includes(lowerSearch) ||
          total.includes(lowerSearch) ||
          menuItemNames.some(name => name.includes(lowerSearch))
        );
      });
    }

    // Filter by payment method + Staff
    result = result.filter(bill => {
      const matchPaymentMethod =
        selectedPaymentMethod === "" ||
        (selectedPaymentMethod === bill.paymentMethod);

      const matchStaff =
        selectedStaff === "" ||
        (parseInt(selectedStaff) === bill.userId)

      return matchPaymentMethod && matchStaff;
    })

    // Filter by day
    const normalizedBills = result.map(bill => ({
      ...bill,
      date: new Date(bill.timestamp).toISOString().slice(0, 10)
    }));

    if (dayOption === "singleDay" && fromDate) {
      result = normalizedBills.filter(bill => bill.date === fromDate);

    } else if (dayOption === "range" && fromDate && toDate) {
      result = normalizedBills.filter(bill =>
        bill.date >= fromDate && bill.date <= toDate
      );
    } else if (fromDate && toDate) {
      result = normalizedBills.filter(bill =>
        bill.date >= fromDate && bill.date <= toDate
      );
    }


    // Sort
    result.sort((a, b) => {
      const timeA = new Date(a.timestamp);
      const timeB = new Date(b.timestamp);
      return sortOrder == "newest" ? timeB - timeA : timeA - timeB;
    });

    return result;
  };

  const paymentMethodMap = {
    Cash: "Tiền mặt",
    Card: "Thẻ",
    Banking: "Chuyển khoản"
  };

  const handleExport = () => {
    const element = document.querySelector('#invoice');
    html2pdf(element);
  }

  return (
    <>
      <Container className="orders-container py-4">
        <div className="d-flex justify-content-between align-items-center mb-2 gap-3 w-100">
          <div className="flex-fill">
            <h2 className="orders-title">🧾 Đơn Đã Hoàn Thành</h2>
          </div>

          <div className="flex-fill d-flex justify-content-end">
            <Button variant='dark' onClick={handleExport}>
              Xuất file PDF
            </Button>
          </div>
        </div>

        <Row>
          {/* Filter */}
          <Col sm={2} md={2} lg={2}>
            <Card
              style={{
                position: "sticky",
                top: 80,
                zIndex: 10,
                backgroundColor: "#f8f9fa",
                boxShadow: "0 0 10px rgba(0,0,0,0.05)",
                border: "none",
              }}
            >
              <Card.Body>
                <h5 className="fw-bold text-center mb-4">Bộ lọc tìm kiếm</h5>

                {/* Day Option */}
                <Form.Group className="mb-3">
                  <Form.Label>Lọc theo thời gian</Form.Label>
                  <Form.Select
                    size="md"
                    value={dayOption}
                    onChange={(e) => handleDayOption(e.target.value)}
                  >
                    <option value="">Tất cả</option>
                    <option value="today">Hôm nay</option>
                    <option value="yesterday">Hôm qua</option>
                    <option value="thisWeek">Tuần này</option>
                    <option value="thisMonth">Tháng này</option>
                    <option value="singleDay">Ngày cụ thể</option>
                    <option value="range">Khoảng thời gian</option>
                  </Form.Select>

                  {/* Input day */}
                  <div className="mt-2">
                    {dayOption === "singleDay" && (
                      <Form.Control
                        type="date"
                        size="sm"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                      />
                    )}

                    {dayOption === "range" && (
                      <div className="d-flex flex-column gap-2">
                        <Form.Control
                          type="date"
                          size="sm"
                          value={fromDate}
                          onChange={(e) => setFromDate(e.target.value)}
                        />
                        <Form.Control
                          type="date"
                          size="sm"
                          value={toDate}
                          onChange={(e) => setToDate(e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                </Form.Group>

                {/* Payment Method */}
                <Form.Group className="mb-3">
                  <Form.Label>Phương thức thanh toán</Form.Label>
                  <Form.Select
                    size="md"
                    value={selectedPaymentMethod}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  >
                    <option value="">Tất cả</option>
                    <option value="Card">Thẻ</option>
                    <option value="Cash">Tiền mặt</option>
                    <option value="Banking">Chuyển khoản ngân hàng</option>
                  </Form.Select>
                </Form.Group>

                {/* Staff */}
                <Form.Group className="mb-3">
                  <Form.Label>Nhân viên</Form.Label>
                  <Form.Select
                    size="md"
                    value={selectedStaff}
                    onChange={(e) => setSelectedStaff(e.target.value)}
                  >
                    <option value="">Tất cả</option>

                    {users.filter(user => user.role === 'waiter')
                      .map((user) => (
                        <option key={user.id} value={user.id}>{user.name}</option>
                      ))}
                  </Form.Select>
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>

          {/* Sort + Table */}
          <Col sm={10} md={10} lg={10}>

            {/* Sort Option */}
            <Row className="mb-3">
              <Col sm={12}>
                <Card
                  className="w-100 px-4 py-3"
                  style={{
                    backgroundColor: "#f8f9fa",
                    border: "none",
                  }}>
                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                    <Form.Group>
                      <Form.Select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        style={{ width: 200, height: 35 }}
                      >
                        <option value="newest">Mới nhất</option>
                        <option value="oldest">Cũ nhất</option>
                      </Form.Select>
                    </Form.Group>

                    <div className="flex-fill d-flex justify-content-center">
                      <Form.Control
                        placeholder="Tìm kiếm..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ width: 450, height: 40 }}
                      />
                    </div>

                    <div className="text-nowrap fw-bold" style={{ fontWeight: 500, color: "#DC3545" }}>
                      Tổng số đơn: {filteredAndSortedBills().length}
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>

            {/* Table */}
            <Row id="invoice">
              <Col sm={12} md={12} lg={12}>
                <Card className="orders-card shadow-sm">
                  <Card.Body className="p-0">
                    <Table responsive hover className="mb-0 order-table">
                      <thead>
                        <tr>
                          <th data-html2canvas-ignore>#</th>
                          <th>Thời gian</th>
                          <th>Bàn</th>
                          <th>Nhân viên gọi món</th>
                          <th>Chi tiết món</th>
                          <th className='text-center'>Tổng tiền</th>
                          <th className='text-center'>Thanh toán</th>
                          <th className='text-center' data-html2canvas-ignore>Xem chi tiết</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAndSortedBills().map((bill) => {
                          const order = orders.find(o => o.id == bill.orderId);

                          return (
                            <tr key={bill.id}>
                              <td data-html2canvas-ignore>{bill.id}</td>
                              <td>
                                {new Date(bill.timestamp).toLocaleString("vi-VN", {
                                  day: '2-digit',
                                  month: '2-digit',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </td>
                              <td><span className="table-pill">#{bill.tableId}</span></td>
                              <td>{users.find((u) => u.id == bill.userId)?.name || "?"}</td>
                              <td>
                                <div className="order-details">
                                  {order?.items.map((item, idx) => (
                                    <div className="detail-item" key={idx}>
                                      <div className="item-name">
                                        {menu.find(i => i.id == item.menuItemId)?.name || `Món #${item.menuItemId}`}
                                      </div>
                                      <div className="item-info">
                                        SL: {item.quantity} | Giá: {item.price.toLocaleString("vi-VN")}đ
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </td>

                              <td className='text-center'><strong>{bill.total.toLocaleString("vi-VN")}đ</strong></td>

                              <td className="text-center">{paymentMethodMap[bill.paymentMethod]}</td>

                              <td className="text-center" data-html2canvas-ignore>
                                <div className="d-flex justify-content-center">
                                  <Button
                                    variant="outline-info"
                                    onClick={() => handleView(bill)}
                                    className="d-flex justify-content-center align-items-center p-0"
                                    style={{ width: '36px', height: '36px' }}
                                  >
                                    <i className="fa-solid fa-eye"></i>
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>

        {/* Modal view order details */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>📝 Chi tiết đơn #{selectedOrder?.id}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {selectedOrder && (
              <>
                <Row>
                  <Col>
                    <p><strong>Thời gian: </strong>{new Date(selectedOrder.timestamp).toLocaleString("vi-VN")}</p>
                    <p><strong>Bàn số: </strong> #{selectedOrder.tableId}</p>
                    <p><strong>Nhân viên gọi món: </strong>
                      {
                        users.find(u => u.id == selectedOrder.userId)?.name || "?"
                      }
                    </p>
                    <p><strong>Phương thức thanh toán: </strong> {paymentMethodMap[selectedOrder.paymentMethod]}</p>
                  </Col>

                  <Col>
                    <p><strong>Tên khách hàng: </strong> {selectedOrder.customerName}</p>
                    <p><strong>Email: </strong> {selectedOrder.customerEmail}</p>
                    <p><strong>Số điện thoại: </strong> {selectedOrder.customerPhone}</p>
                  </Col>
                </Row>

                <hr />

                <Table striped bordered hover size="sm">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Tên món</th>
                      <th>Số lượng</th>
                      <th>Đơn giá</th>
                      <th>Tổng</th>
                    </tr>
                  </thead>

                  <tbody>
                    {(() => {
                      const order = orders.find(o => o.id == selectedOrder.orderId);
                      if (!order) return (
                        <tr><td colSpan={5}>Không tìm thấy đơn hàng</td></tr>
                      );

                      return order.items.map((item, index) => {
                        const menuItem = menu.find(i => String(i.id) === String(item.menuItemId));
                        const totalItemPrice = item.quantity * item.price;

                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{menuItem?.name || `[Món #${item.menuItemId} không tồn tại]`}</td>
                            <td>{item.quantity}</td>
                            <td>{item.price.toLocaleString("vi-VN")}đ</td>
                            <td>{totalItemPrice.toLocaleString("vi-VN")}đ</td>
                          </tr>
                        );
                      });
                    })()}
                  </tbody>
                </Table>
                <p className="mt-3"><strong>Tổng tiền: </strong> {selectedOrder.total.toLocaleString("vi-VN")}đ</p>
              </>
            )}
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Đóng</Button>
          </Modal.Footer>
        </Modal>

      </Container >
    </>
  )
}