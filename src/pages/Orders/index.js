import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Table, Form, Badge, Card, Modal } from "react-bootstrap";
import { } from "react-router-dom";
import axios from 'axios';
import './orders.css';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [bills, setBills] = useState([]);
  const [users, setUsers] = useState([]);
  const [menu, setMenu] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  // const [showAddModal, setShowAddModal] = useState(false);
  // const [newOrder, setNewOrder] = useState({
  //   tableId: '',
  //   userId: '',
  //   items: [],
  //   status: 'In Progress',
  //   timestamp: new Date().toISOString(),
  // });
  const [selectedMenuItemId, setSelectedMenuItemId] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [statusFilter, setStatusFilter] = useState({});

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

  const statusColors = {
    "In Progress": "warning",
    "Ready": "success",
    "Canceled": "danger",
    "Completed": "primary",
  };

  const statusLabels = {
    "In Progress": "Đang chuẩn bị",
    "Ready": "Sẵn sàng",
    "Canceled": "Đã hủy",
    "Completed": "Hoàn tất",
  };

  // const handleStatusChange = (orderId, newStatus) => {
  //   const updatedOrders = orders.map(order =>
  //     order.id === orderId ? { ...order, status: newStatus } : order
  //   );
  //   setOrders(updatedOrders);

  //   axios.patch(`http://localhost:9999/orders/${orderId}`, {
  //     status: newStatus
  //   })
  //     .then(() => {
  //       console.log("Đã cập nhật trạng thái đơn hàng");
  //     })
  //     .catch((error) => {
  //       console.error("Lỗi khi cập nhật trạng thái:", error);
  //       setOrders(orders);
  //     });
  // };

  const handleView = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  // const getNextOrderId = (orders) => {
  //   const numericIds = orders.map(order => parseInt(order.id))
  //     .filter(id => !isNaN(id));

  //   const maxId = Math.max(...numericIds, 0);
  //   return (maxId + 1).toString();
  // };

  // const handleAddOrder = () => {
  //   if (!newOrder.tableId || !newOrder.userId) {
  //     alert("Vui lòng chọn bàn và nhân viên phục vụ");
  //     return;
  //   }

  //   if (newOrder.items.length === 0) {
  //     alert("Vui lòng thêm ít nhất một món vào đơn đặt bàn");
  //     return;
  //   }

  //   const newId = getNextOrderId(orders);

  //   const fixedItems = newOrder.items.map(item => ({
  //     menuItemId: Number(item.menuItemId),
  //     quantity: Number(item.quantity),
  //     price: Number(item.price),
  //   }));

  //   const total = fixedItems.reduce(
  //     (sum, item) => sum + item.quantity * item.price, 0
  //   );

  //   const fixedOrder = {
  //     ...newOrder,
  //     id: newId,
  //     tableId: Number(newOrder.tableId),
  //     userId: Number(newOrder.userId),
  //     items: fixedItems,
  //     total,
  //     status: 'In Progress',
  //     timestamp: new Date().toISOString(),
  //   };

  //   axios.post('http://localhost:9999/orders', fixedOrder)
  //     .then(response => {
  //       setOrders(prev => [...prev, response.data]);
  //       setShowAddModal(false);

  //     })
  //     .catch(error => {
  //       console.error("Lỗi khi thêm đơn hàng:", error);
  //     });
  // };

  // const handleAddMenuItem = () => {
  //   if (!selectedMenuItemId || selectedQuantity < 1) return;

  //   const menuItem = menu.find(m => Number(m.id) === Number(selectedMenuItemId));
  //   if (!menuItem) return;

  //   const newItem = {
  //     menuItemId: Number(menuItem.id),
  //     quantity: Number(selectedQuantity),
  //     price: Number(menuItem.price)
  //   };

  //   setNewOrder(prev => ({
  //     ...prev,
  //     items: [...prev.items, newItem]
  //   }));

  //   setSelectedMenuItemId('');
  //   setSelectedQuantity(1);
  // };

  // const handleDelete = (orderId) => {
  //   if (window.confirm("Bạn chắc chắn muốn xóa đơn hàng này?")) {
  //     axios.delete(`http://localhost:9999/orders/${orderId}`)
  //       .then(() => {
  //         setOrders(prev => prev.filter(order => order.id !== orderId));
  //       })
  //       .catch(err => console.error("Xoá thất bại", err));
  //   }
  // };

  const getFilteredAndSortedOrders = () => {
    let result = [...orders];

    // Filter by status
    const hasAnyStatusFilter = Object.values(statusFilter).some(v => v);
    if (hasAnyStatusFilter) {
      result = result.filter(order => statusFilter[order.status]);
    }

    // Search
    if (searchText.trim() !== "") {
      const lowerSearch = searchText.toLowerCase();
      result = result.filter(order => {
        const userName = users.find(u => u.id == order.userId)?.name?.toLowerCase() || "";
        const orderTime = new Date(order.timestamp).toLocaleString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });

        return (
          userName.includes(lowerSearch) ||
          orderTime.includes(lowerSearch)
        );
      });
    }

    // Sort
    result.sort((a, b) => {
      const timeA = new Date(a.timestamp);
      const timeB = new Date(b.timestamp);
      return sortOrder == "newest" ? timeB - timeA : timeA - timeB;
    });

    return result;
  };

  const filteredAndSortedBills = () => {
    let result = [...bills];

    // Filter by status
    // const hasAnyStatusFilter = Object.values(statusFilter).some(v => v);
    // if (hasAnyStatusFilter) {
    //   result = result.filter(order => statusFilter[order.status]);
    // }

    // Search
    if (searchText.trim() !== "") {
      const lowerSearch = searchText.toLowerCase();
      result = result.filter(bill => {
        const userName = users.find(u => u.id == bill.userId)?.name?.toLowerCase() || "";
        const orderTime = new Date(bill.timestamp).toLocaleString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });

        return (
          userName.includes(lowerSearch) ||
          orderTime.includes(lowerSearch)
        );
      });
    }

    // Sort
    result.sort((a, b) => {
      const timeA = new Date(a.timestamp);
      const timeB = new Date(b.timestamp);
      return sortOrder == "newest" ? timeB - timeA : timeA - timeB;
    });

    return result;
  };

  return (
    <>
      <Container className="orders-container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4 gap-3 w-100">
          <div className="flex-fill">
            <h2 className="orders-title">🧾 Đơn Đã Hoàn Thành</h2>
          </div>

          <div className="flex-fill d-flex justify-content-center">
            <Form.Control
              placeholder="Tìm kiếm..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 450, height: 40 }}
            />
          </div>

          <div className="flex-fill d-flex justify-content-end">
            <Button variant='dark'>
              Export to PDF/Excel
            </Button>
          </div>
        </div>

        <Row>

          {/* Filter */}
          <Col md={3} lg={3}>
            <Card
              style={{
                position: "sticky",
                top: 80,
                zIndex: 10,
                backgroundColor: "#f8f9fa", // màu nền sáng
                boxShadow: "0 0 10px rgba(0,0,0,0.05)",
                border: "none",
              }}
            >
              <Card.Body>
                <h5 className="fw-bold text-center mb-4">🔍 Bộ lọc tìm kiếm</h5>

                {/* Từ khóa */}
                <Form.Group className="mb-3">
                  <Form.Label>Từ khóa</Form.Label>
                  <Form.Control
                    size="sm"
                    placeholder="Tìm món / bàn / nhân viên..."
                  // value={searchText}
                  // onChange={(e) => setSearchText(e.target.value)}
                  />
                </Form.Group>

                {/* Trạng thái đơn */}
                <Form.Group className="mb-3">
                  <Form.Label>Trạng thái đơn</Form.Label>
                  <Form.Select
                    size="sm"
                  // value={statusFilter}
                  // onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="">Tất cả</option>
                    <option value="paid">Đã thanh toán</option>
                    <option value="unpaid">Chưa thanh toán</option>
                  </Form.Select>
                </Form.Group>

                {/* Khoảng thời gian */}
                <Form.Group className="mb-3">
                  <Form.Label>Thời gian</Form.Label>
                  <Form.Control
                    type="date"
                    size="sm"
                  // value={startDate}
                  // onChange={(e) => setStartDate(e.target.value)}
                  />
                  <div className="text-center my-2">đến</div>
                  <Form.Control
                    type="date"
                    size="sm"
                  // value={endDate}
                  // onChange={(e) => setEndDate(e.target.value)}
                  />
                </Form.Group>

                {/* Lọc theo bàn */}
                <Form.Group className="mb-3">
                  <Form.Label>Bàn</Form.Label>
                  <Form.Select
                    size="sm"
                  // value={tableFilter}
                  // onChange={(e) => setTableFilter(e.target.value)}
                  >
                    <option value="">Tất cả</option>
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>Bàn #{num}</option>
                    ))}
                  </Form.Select>
                </Form.Group>

                {/* Button áp dụng */}
                <div className="d-grid">
                  <Button variant="dark" size="sm">
                    Áp dụng lọc
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>


          {/* Sort + Table */}
          <Col md={9} lg={9}>

            {/* Sort Option */}
            <Row className="mb-3">
              <Col sm={12}>
                <Card className="w-100 px-4 py-3" style={{ backgroundColor: "#f8f9fa" }}>
                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                    <Form.Select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                      style={{ width: 200, height: 35 }}
                    >
                      <option value="newest">Mới nhất</option>
                      <option value="oldest">Cũ nhất</option>
                    </Form.Select>

                    <Form.Select style={{ width: 200 }}>
                      <option>Trạng thái</option>
                      <option value="paid">Đã thanh toán</option>
                      <option value="unpaid">Chưa thanh toán</option>
                    </Form.Select>

                    <Button variant="dark">Áp dụng</Button>
                    <span style={{ fontWeight: 500 }}>Tổng số đơn: 10</span>
                  </div>
                </Card>
              </Col>
            </Row>



            {/* Table */}
            <Row>
              <Col sm={12} md={12} lg={12}>
                <Card className="orders-card shadow-sm">
                  <Card.Body className="p-0">
                    <Table responsive hover className="mb-0 order-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Thời gian</th>
                          <th>Bàn</th>
                          <th>Nhân viên gọi món</th>
                          <th>Chi tiết món</th>
                          <th>Tổng tiền</th>
                          {/* <th>Trạng thái</th> */}
                          <th>Xem chi tiết</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAndSortedBills().map((bill) => {
                          const order = orders.find(o => o.id == bill.orderId);

                          return (
                            <tr key={bill.id}>
                              <td>{bill.id}</td>
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
                              <td><strong>{bill.total.toLocaleString("vi-VN")}đ</strong></td>
                              {/* <td>
                            <Form.Select
                              size="sm"
                              value={status}
                              onChange={(e) => handleStatusChange(order.id, e.target.value)}
                              className="status-select"
                              style={{ marginTop: "28px" }}
                            >
                              {Object.keys(statusLabels).map((statusOption) => (
                                <option key={statusOption} value={statusOption}>
                                  {statusLabels[statusOption]}
                                </option>
                              ))}
                            </Form.Select>
                            <Badge bg={statusColors[status]} className="status-badge mt-1">{statusLabels[status]}</Badge>
                          </td> */}

                              <td>
                                <div className="d-flex gap-2">
                                  <Button
                                    variant="outline-info"
                                    size="sm"
                                    onClick={() => handleView(order)}
                                  >
                                    <i className="fa-solid fa-eye"></i>
                                  </Button>
                                  {/* <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDelete(order.id)}
                              >
                                <i className="fa-solid fa-trash"></i>
                              </Button> */}
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

              {/* <Col sm={2} md={2} lg={2}>
            <Card>
              <Card.Body>
                <Card.Title>Lọc theo trạng thái</Card.Title>
                <Form>
                  {Object.keys(statusLabels).map(status => (
                    <Form.Check
                      key={status}
                      type="checkbox"
                      label={statusLabels[status]}
                      className="mb-2"
                      checked={statusFilter[status]}
                      onChange={(e) => setStatusFilter(prev => ({
                        ...prev,
                        [status]: e.target.checked,
                      }))}
                    />
                  ))}
                </Form>
              </Card.Body>
            </Card>
          </Col> */}
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
                <p><strong>Thời gian: </strong>{new Date(selectedOrder.timestamp).toLocaleString("vi-VN")}</p>
                <p><strong>Bàn số: </strong> #{selectedOrder.tableId}</p>
                <p><strong>Nhân viên gọi món: </strong> {
                  users.find(u => u.id == selectedOrder.userId)?.name || "?"
                }</p>
                {/* <p><strong>Trạng thái:</strong> {statusLabels[selectedOrder.status]}</p> */}
                <hr />
                <h5>📋 Chi tiết món</h5>
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
                      const order = orders.find(o => o.id === selectedOrder.orderId);
                      if (!order) return (
                        <tr><td colSpan={5}>Không tìm thấy đơn hàng</td></tr>
                      );

                      return order.items.map((item, index) => {
                        const menuItem = menu.find(i => i.id == item.menuItemId);
                        const totalItemPrice = item.quantity * item.price;
                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{menuItem?.name}</td>
                            <td>{item.quantity}</td>
                            <td>{item.price.toLocaleString("vi-VN")}đ</td>
                            <td>{totalItemPrice.toLocaleString("vi-VN")}đ</td>
                          </tr>
                        );
                      })
                    })}


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

        {/* Modal add new order */}
        {/* <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Thêm đơn đặt bàn mới</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Bàn số</Form.Label>
              <Form.Select
                value={newOrder.tableId}
                onChange={(e) => setNewOrder({ ...newOrder, tableId: Number(e.target.value) })}
              >
                <option value="">-- Chọn bàn --</option>
                {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num}>Bàn {num}</option>
                ))}
              </Form.Select>

            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Nhân viên</Form.Label>
              <Form.Select
                value={newOrder.userId}
                onChange={(e) => setNewOrder({ ...newOrder, userId: e.target.value })}
              >
                <option value="">-- Chọn nhân viên --</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Row className="align-items-end">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Món ăn</Form.Label>
                  <Form.Select
                    value={selectedMenuItemId}
                    onChange={(e) => setSelectedMenuItemId(e.target.value)}
                  >
                    <option value="">-- Chọn món --</option>
                    {menu.map(item => (
                      <option key={item.id} value={item.id}>{item.name} - {item.price.toLocaleString("vi-VN")}đ</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Số lượng</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    value={selectedQuantity}
                    onChange={(e) => setSelectedQuantity(Number(e.target.value))}
                  />
                </Form.Group>
              </Col>

              <Col md={3}>
                <Button variant="success" style={{ width: "80px", height: "40px", marginBottom: "15px" }} onClick={handleAddMenuItem}>Thêm</Button>
              </Col>
            </Row>
          </Modal.Body> */}

        {/* Danh sách món đã chọn */}
        {/* <Container>
            {newOrder.items.length > 0 && (
              <Table size="sm" bordered className="mt-3">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Món</th>
                    <th>SL</th>
                    <th>Đơn giá</th>
                    <th>Tổng</th>
                  </tr>
                </thead>
                <tbody>
                  {newOrder.items.map((item, index) => {
                    const menuItem = menu.find(m => m.id == item.menuItemId);
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{menuItem?.name}</td>
                        <td>{item.quantity}</td>
                        <td>{item.price.toLocaleString("vi-VN")}đ</td>
                        <td>{(item.quantity * item.price).toLocaleString("vi-VN")}đ</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={4} className="text-end fw-bold">Tổng tiền:</td>
                    <td className="fw-bold">
                      {newOrder.items.reduce((sum, item) => sum + item.quantity * item.price, 0).toLocaleString("vi-VN")}đ
                    </td>
                  </tr>
                </tfoot>
              </Table>
            )}
          </Container>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>Hủy</Button>
            <Button variant="primary" onClick={handleAddOrder}>Lưu</Button>
          </Modal.Footer>
        </Modal> */}

      </Container >
    </>
  )
}