import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Table, InputGroup } from "react-bootstrap";
import axios from "axios";

const API_URL = "http://localhost:3001/users";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "waiter",
    phone: "",
    password: "",
  });

  const fetchUsers = async () => {
    const res = await axios.get(API_URL);
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenModal = (user = null) => {
    setEditingUser(user);
    setFormData(
      user || {
        name: "",
        role: "waiter",
        phone: "",
        password: "",
      }
    );
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (editingUser) {
      await axios.put(`${API_URL}/${editingUser.id}`, formData);
    } else {
      await axios.post(API_URL, { ...formData, id: Date.now().toString() });
    }
    fetchUsers();
    handleCloseModal();
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchUsers();
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Quản lý người dùng</h4>
        <Button onClick={() => handleOpenModal()}>Thêm người dùng</Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Tên</th>
            <th>Vai trò</th>
            <th>Số điện thoại</th>
            <th>Mật khẩu</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.role}</td>
              <td>{user.phone}</td>
              <td>{user.password}</td>
              <td>
                <Button variant="warning" size="sm" onClick={() => handleOpenModal(user)}>
                  Sửa
                </Button>{" "}
                <Button variant="danger" size="sm" onClick={() => handleDelete(user.id)}>
                  Xóa
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingUser ? "Chỉnh sửa người dùng" : "Thêm người dùng"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Tên</Form.Label>
              <Form.Control
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nhập tên"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Vai trò</Form.Label>
              <Form.Select name="role" value={formData.role} onChange={handleChange}>
                <option value="waiter">Nhân viên</option>
                <option value="admin">Quản trị</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Số điện thoại</Form.Label>
              <Form.Control
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Nhập số điện thoại"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mật khẩu</Form.Label>
              <Form.Control
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Hủy
          </Button>
          <Button variant="primary" style={{cursor: "pointer"}} onClick={handleSave}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserManagement;
