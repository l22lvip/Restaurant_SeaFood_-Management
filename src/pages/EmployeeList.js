// pages/EmployeeList.js
import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:9999/employees";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  const fetchEmployees = async () => {
    const res = await axios.get(API_URL);
    setEmployees(res.data);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Bạn có chắc chắn muốn xóa nhân viên này không?");
    if (confirm) {
      await axios.delete(`${API_URL}/${id}`);
      fetchEmployees();
    }
  };

  const [search, setSearch] = useState("");

  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(search.toLowerCase())
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
            <th>Địa chỉ</th>
            <th>Email</th>
            <th>Giới tính</th>
            <th>Vai trò</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.name}</td>
              <td>{employee.phone}</td>
              <td>{employee.age}</td>
              <td>{employee.address}</td>
              <td>{employee.email}</td>
              <td>{employee.gender === "male" ? "Nam" : employee.gender === "female" ? "Nữ" : "Khác"}</td>
              <td>{employee.role === "admin" ? "Quản lý" : "Nhân viên"}</td>
              <td className="user-actions">
                <button
                  className="edit-btn"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/admin/employees/edit/${employee.id}`)}
                >
                  Sửa
                </button>
                <button
                  className="delete-btn"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleDelete(employee.id)}
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
