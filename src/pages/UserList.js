// pages/UserList.js
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
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

  return (
    <div className="user-page">
      <div className="user-header">
        <h4 className="user-title">Danh sách nhân viên</h4>
        <Button style={{cursor: "pointer"}} onClick={() => navigate("/users/create")}>Thêm nhân viên</Button>
      </div>

      <table className="table user-list-table">
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
              <td className="user-actions">
                <button
                  className="edit-btn"
                  style={{cursor: "pointer"}}
                  onClick={() => navigate(`/users/edit/${user.id}`)}
                >
                  Sửa
                </button>
                <button
                  className="delete-btn"
                  style={{cursor: "pointer"}}
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
