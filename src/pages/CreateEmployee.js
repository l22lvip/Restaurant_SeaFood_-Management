import React, { useState } from "react";
import { Button, Form, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserForm from "./UserForm";
import "../css/UserForm.css";

const API_URL = "http://localhost:9999/employees";

const CreateEmployee = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    age: "",
    address: "",
    email: "",
    gender: "",
    role: "staff",
    password: "",
    salary: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, phone, age, address,  gender, password, salary } = formData;

    if (!name.trim()) {
      alert("Tên không được để trống");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      alert("Số điện thoại phải đủ 10 chữ số");
      return;
    }

    if (!password.trim() || password.length < 6) {
      alert("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (Number(age) < 18 || Number(age) > 60) {
      alert("Tuổi làm việc phải từ 18 đến 60");
      return;
    }

    if (!address.trim()) {
      alert("Địa chỉ không được để trống");
      return;
    }

    if (Number(salary) < 0) {
      alert("Lương không được để trống");
      return;
    }

    try {
      await axios.post(API_URL, {
        ...formData,
        id: Date.now().toString(),
        age: Number(age)
      });
      alert("Tạo nhân viên thành công!");
      navigate("/admin/employees");
    } catch (error) {
      console.error("Lỗi khi tạo nhân viên:", error);
      alert("Tạo nhân viên thất bại");
    }
  };


  return (
    <div className="user-page">
      <Container className="user-form-container bg-dark-2">
        <h4>Thêm nhân viên</h4>
        <Form onSubmit={handleSubmit}>
          <UserForm formData={formData} handleChange={handleChange} />
          <Button type="submit" style={{ cursor: "pointer" }}>Lưu</Button>
        </Form>
      </Container>
    </div>
  );
};

export default CreateEmployee;
