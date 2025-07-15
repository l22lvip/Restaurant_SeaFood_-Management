import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Table, Form, Badge } from "react-bootstrap";
import { } from "react-router-dom";

export default function Orders() {
  const [data, setData] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch('/db.json')
      .then(response => response.json())
      .then(json => {
        setData(json);
        setOrders(json.orders)
      });
  }, [])

  const users = data.users;
  const menu = data.menuItems;

  const statusColors = {
    "In Progress": "warning",
    "Ready": "success",
    "Canceled": "danger",
    "Completed": "primary",
  };

  const handleStatusChange = (orderId, newStatus) => {
    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
  }

  return (
    <>
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>🧾 Order List</h3>
          <Button variant="success">➕ Add New Order</Button>
        </div>
        <Table bordered hover responsive>
          <thead className="table-light">
            <th>ID</th>
            <th>Table</th>
            <th>Staff Name</th>
            <th>Order Detail</th>
            <th>Total</th>
            <th>Status</th>
            <th>Datetime</th>
          </thead>
          <tbody>
            {orders.map((order, index) => {
              const status = order.status;
              const rowClass = `table-${statusColors[status] || "light"}`;

              return (
                <tr key={order.id} className={rowClass}>
                  <td>{index + 1}</td>
                  <td>{order.tableId}</td>
                  <td>
                    {users.find((u) => order.userId == u.id)?.name || "?"}
                  </td>
                  <td>
                    <ul style={{ paddingLeft: "1rem", margin: 0 }}>
                      {order.items.map((item, idx) => (
                        <li key={idx}>
                          {
                            menu.find((i) => item.menuItemId == i.id)?.name || `Món #${item.menuItemId}`
                          }
                          {" "}– SL: {item.quantity} – Giá: {item.price.toLocaleString()}đ
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>{order.total.toLocaleString()}đ</td>
                  <td>
                    <Form.Select
                      value={status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      style={{ maxWidth: "150px" }}
                    >
                      {Object.keys(statusColors).map((statusOption) => (
                        <option key={statusOption} value={statusOption}>
                          {statusOption}
                        </option>
                      ))}
                    </Form.Select>
                    <Badge bg={statusColors[status]} className="mt-1">{status}</Badge>
                  </td>
                  <td>{new Date(order.timestamp).toLocaleString("vi-VN")}</td>
                </tr>
              );
            })}
          </tbody>
        </Table >
      </Container>
    </>
  )
}