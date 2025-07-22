import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Table, Form, Badge, Card, Modal, FormGroup } from "react-bootstrap";
import { } from "react-router-dom";
import axios from 'axios';
import '../css/OrderManagement.css';
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
    const [isExporting, setIsExporting] = useState(false);

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
        const result = filteredAndSortedBills();

        if (!result || result.length === 0) {
            alert("Không có dữ liệu để xuất file PDF.");
            return;
        }

        setIsExporting(true);
        setTimeout(() => {
            const element = document.querySelector('#invoice');
            html2pdf(element);

            setIsExporting(false);
        }, 100); // Delay 100ms
    }

    return (
        <>
            <Container className="completed-order-container py-4">
                <div className="d-flex justify-content-between align-items-center mb-2 gap-3 w-100 completed-order-header">
                    <div className="flex-fill">
                        <h2 className="completed-order-title">🧾 Đơn Đã Hoàn Thành</h2>
                    </div>

                    <div className="flex-fill d-flex justify-content-end export-button">
                        <Button variant='dark' onClick={handleExport}>
                            Xuất file PDF
                        </Button>
                    </div>
                </div>

                <div className="completed-order-body">

                    {/* Filter */}
                    <aside className="completed-order-sidebar">
                        <Row>
                            <Col sm={2} md={2} lg={2}>
                                <Card
                                    style={{
                                        position: "sticky",
                                        top: 80,
                                        zIndex: 10,
                                        // backgroundColor: "#f8f9fa",
                                        // boxShadow: "0 0 10px rgba(0,0,0,0.05)",
                                        border: "none",
                                    }}
                                >
                                    <div className="filter-card-body">
                                        <h5 className="filter-title">Bộ lọc tìm kiếm</h5>

                                        <div className="filter-group">
                                            {/* Day Option */}
                                            <label className="filter-label">Lọc theo thời gian</label>
                                            <select
                                                className="filter-select"
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
                                            </select>

                                            {/* Input day */}
                                            <div className="mt-2">
                                                {dayOption === "singleDay" && (
                                                    <Form.Control
                                                        type="date"
                                                        size="sm"
                                                        className="filter-select"
                                                        value={fromDate}
                                                        onChange={(e) => setFromDate(e.target.value)}
                                                    />
                                                )}

                                                {dayOption === "range" && (
                                                    <div className="d-flex flex-column gap-2 filter-select-1">
                                                        <Form.Control
                                                            type="date"
                                                            size="sm"
                                                            className="filter-select filter-select-2"
                                                            value={fromDate}
                                                            onChange={(e) => setFromDate(e.target.value)}
                                                        />
                                                        <Form.Control
                                                            type="date"
                                                            size="sm"
                                                            className="filter-select"
                                                            value={toDate}
                                                            onChange={(e) => setToDate(e.target.value)}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="filter-group">
                                            {/* Payment Method */}
                                            <label className="filter-label">Phương thức thanh toán</label>
                                            <select
                                                className="filter-select"
                                                value={selectedPaymentMethod}
                                                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                                            >
                                                <option value="">Tất cả</option>
                                                <option value="Card">Thẻ</option>
                                                <option value="Cash">Tiền mặt</option>
                                                <option value="Banking">Chuyển khoản ngân hàng</option>
                                            </select>
                                        </div>

                                        <div className="filter-group">
                                            {/* Staff */}
                                            <label className="filter-label">Nhân viên</label>
                                            <select
                                                className="filter-select"
                                                value={selectedStaff}
                                                onChange={(e) => setSelectedStaff(e.target.value)}
                                            >
                                                <option value="">Tất cả</option>

                                                {users.filter(user => user?.role === 'staff')
                                                    .map((user) => (
                                                        <option key={user.id} value={user.id}>{user.name}</option>
                                                    ))}
                                            </select>

                                        </div>

                                    </div>
                                </Card>
                            </Col>
                        </Row>
                    </aside>

                    <main className="completed-order-main">
                        {/* Sort + Table */}
                        <Row>
                            <Col sm={10} md={10} lg={10}>

                                {/* Sort + Seach Option */}
                                <div className='sort-option'>
                                    <Row className="mb-3">
                                        <Col sm={12}>
                                            <Card className="search-sort-card">
                                                <Form.Select
                                                    className='filter-select'
                                                    value={sortOrder}
                                                    onChange={(e) => setSortOrder(e.target.value)}
                                                >
                                                    <option value="newest">Mới nhất</option>
                                                    <option value="oldest">Cũ nhất</option>
                                                </Form.Select>

                                                <Form.Control
                                                    className='sort-searchbar'
                                                    placeholder="Tìm kiếm..."
                                                    value={searchText}
                                                    onChange={(e) => setSearchText(e.target.value)}
                                                />

                                                <div className="completed-total-order">
                                                    Tổng số đơn: {filteredAndSortedBills().length}
                                                </div>
                                            </Card>

                                        </Col>
                                    </Row>
                                </div>

                                {/* Table */}
                                <div style={{ overflowX: 'auto' }}>
                                    <Row className='completed-order-table'>
                                        <Col sm={12} md={12} lg={12}>
                                            <Card className="completed-order-card shadow-sm">
                                                <Card.Body className="p-0">
                                                    <Table responsive hover className={`mb-0 completed-order-table ${isExporting ? 'fixed-layout' : ''}`} id="invoice">
                                                        <thead>
                                                            <tr>
                                                                <th data-html2canvas-ignore>#</th>
                                                                <th>Thời gian</th>
                                                                <th data-html2canvas-ignore>Bàn</th>
                                                                <th>Nhân viên</th>
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
                                                                        <td data-html2canvas-ignore><span className="table-pill">#{bill.tableId}</span></td>
                                                                        <td>{users.find((u) => u.id == bill.userId)?.name || "?"}</td>
                                                                        <td>
                                                                            <div className="completed-order-details">
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
                                                                                <button
                                                                                    variant="outline-info"
                                                                                    onClick={() => handleView(bill)}
                                                                                    className="d-flex justify-content-center align-items-center p-0 eye-button"
                                                                                    style={{ width: '36px', height: '36px' }}
                                                                                >
                                                                                    <i className="fa-solid fa-eye"></i>
                                                                                </button>
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
                                </div>
                            </Col>
                        </Row>
                    </main>
                </div>

                {/* Modal view order details */}
                {showModal && (
                    <>
                        <div className="completed-modal-backdrop" onClick={() => setShowModal(false)} size="lg" centered></div>
                        <div className="completed-modal">
                            <div className="completed-modal-header">
                                <span className="completed-modal-title">📝 Chi tiết đơn #{selectedOrder?.id}</span>
                                <button className="completed-close-button" onClick={() => setShowModal(false)}>×</button>
                            </div>

                            <div className="completed-modal-body">
                                {selectedOrder && (
                                    <>
                                        <div className="completed-row">
                                            <div className="completed-col">
                                                <p><strong>Thời gian: </strong>{new Date(selectedOrder.timestamp).toLocaleString("vi-VN")}</p>
                                                <p><strong>Bàn số: </strong> #{selectedOrder.tableId}</p>
                                                <p><strong>Nhân viên gọi món: </strong>
                                                    {
                                                        users.find(u => u.id == selectedOrder.userId)?.name || "?"
                                                    }
                                                </p>
                                                <p><strong>Phương thức thanh toán: </strong> {paymentMethodMap[selectedOrder.paymentMethod]}</p>
                                            </div>

                                            <div className="completed-col">
                                                <p><strong>Tên khách hàng: </strong> {selectedOrder.customerName}</p>
                                                {/* <p><strong>Email: </strong> {selectedOrder.customerEmail}</p> */}
                                                <p><strong>Số điện thoại: </strong> {selectedOrder.customerPhone}</p>
                                            </div>
                                        </div>

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
                                        <p className="mt-3"><strong>Tổng tiền: {selectedOrder.total.toLocaleString("vi-VN")}đ</strong></p>
                                    </>
                                )}
                            </div>

                            <div className="completed-modal-footer">
                                {/* <Button variant="secondary" onClick={() => setShowModal(false)}>Đóng</Button> */}
                                <button className="completed-btn" onClick={() => setShowModal(false)}>Đóng</button>
                            </div>
                        </div>
                    </>
                )}
            </Container >
        </>
    )
}