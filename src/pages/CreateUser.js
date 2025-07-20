import React, { useState } from "react";
import { Button, Form, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserForm from "./UserForm";
import "../css/UserForm.css";


const CreateUser = () => {
  const [formData, setFormData] = useState({
    name: "",
    role: "staff",
    phone: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, phone, password } = formData;

    if (!name.trim()) {
      alert("Tên không được để trống");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      alert("Số điện thoại phải đủ 10 chữ số");
      return;
    }

    if (password.length < 6) {
      alert("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    try {
      await axios.post(API_URL, { ...formData, id: Date.now().toString() });
      navigate("/users");
    } catch (error) {
      console.error("Lỗi khi tạo người dùng:", error);
      alert("Tạo người dùng thất bại");
    }
  };


  return (
    <div className="user-page">
      <Container className="user-form-container bg-dark-2">
        <h4>Thêm người dùng</h4>
        <Form onSubmit={handleSubmit}>
          <UserForm formData={formData} handleChange={handleChange} />
          <Button type="submit" style={{ cursor: "pointer" }}>Lưu</Button>
        </Form>
      </Container>
    </div>
  );
};

export default CreateUser;
