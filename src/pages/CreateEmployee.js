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
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, phone, age, address, email, gender } = formData;

    if (!name.trim()) {
      alert("Tên không được để trống");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      alert("Số điện thoại phải đủ 10 chữ số");
      return;
    }
    if (age < 18 || age > 60) {
      alert("Tuổi làm việc phải từ 18 đến 60");
      return;
    }


    try {
      await axios.post(API_URL, { ...formData, id: Date.now().toString() });
      navigate("/admin/employees");
    } catch (error) {
      console.error("Lỗi khi tạo người dùng:", error);
      alert("Tạo người dùng thất bại");
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
