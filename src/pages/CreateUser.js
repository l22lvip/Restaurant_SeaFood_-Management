import React, { useState } from "react";
import { Button, Form, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserForm from "./UserForm";
import "../css/UserForm.css";

const API_URL = "http://localhost:9999/users";

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
    await axios.post(API_URL, { ...formData, id: Date.now().toString() });
    navigate("/users");
  };

  return (
    <div className="user-page">
      <Container className="user-form-container bg-dark-2">
        <h4>Thêm người dùng</h4>
        <Form onSubmit={handleSubmit}>
        <UserForm formData={formData} handleChange={handleChange} />
        <Button type="submit" style={{cursor: "pointer"}}>Lưu</Button>
      </Form>
    </Container>
    </div>
  );
};

export default CreateUser;
