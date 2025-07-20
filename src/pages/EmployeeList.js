// pages/EmployeeList.js
import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:9999/employees";

const EmployeeList = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    const res = await axios.get(API_URL);
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Bạn có chắc chắn muốn xóa nhân viên này không?");
    if (confirm) {
      await axios.delete(`${API_URL}/${id}`);
      fetchUsers();
    }
  };

  const [search, setSearch] = useState("");

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="user-page">
      <div className="user-header">
        <h4 className="user-title">Quản lý nhân viên</h4>

        <Button style={{ cursor: "pointer" }} onClick={() => navigate("/admin/employees/create")}>
          Thêm nhân viên
        </Button>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <Form.Control
          type="text"
          placeholder="Tìm kiếm theo tên..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className="table user-list-table">
        <thead>
          <tr>
            <th>Tên</th>
            <th>Số điện thoại</th>
            <th>Tuổi</th>
            <th>Email</th>
            <th>Giới tính</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.phone}</td>
              <td>{user.age}</td>
              <td>{user.email}</td>
              <td>{user.gender === "male" ? "Nam" : user.gender === "female" ? "Nữ" : "Khác"}</td>
              <td className="user-actions">
                <button
                  className="edit-btn"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/admin/employees/edit/${user.id}`)}
                >
                  Sửa
                </button>
                <button
                  className="delete-btn"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleDelete(user.id)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;
