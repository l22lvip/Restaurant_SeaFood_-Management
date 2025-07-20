// pages/UserList.js
import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:9999/users";

const UserList = () => {
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

    const confirm = window.confirm("Bạn có chắc chắn muốn xóa người dùng này không?");
    if (confirm) {
      await axios.delete(`${API_URL}/${id}`);
      fetchUsers();
    }
  };

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) &&
    (roleFilter === "" || user.role === roleFilter)
  );

  return (
    <div className="user-page">
      <div className="user-header">
        <h4 className="user-title">Danh sách nhân viên</h4>
        
        <div style={{ display: "flex", gap: "1rem" }}>

          <Button style={{ cursor: "pointer" }} onClick={() => navigate("/users/create")}>
            Thêm nhân viên
          </Button>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "", alignItems: "center" }}>
        <Form.Control
          type="text"
          placeholder="Tìm kiếm theo tên..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginBottom: "1rem" }}
        />
        <Form.Select
          style={{ width: "200px", marginLeft: "1rem" }}
          onChange={(e) => setRoleFilter(e.target.value)}
          value={roleFilter}
        >
          <option value="">Tất cả vai trò</option>
          <option value="admin">Quản trị viên</option>
          <option value="staff">Nhân viên</option>
        </Form.Select>
      </div>

      <table className="table user-list-table">
        <thead>
          <tr>
            <th>Tên</th>
            <th>Vai trò</th>
            <th>Số điện thoại</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.role === 'admin' ? 'Quản trị viên' : 'Nhân viên'}</td>
              <td>{user.phone}</td>
              <td className="user-actions">
                <button
                  className="edit-btn"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/users/edit/${user.id}`)}
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

export default UserList;
