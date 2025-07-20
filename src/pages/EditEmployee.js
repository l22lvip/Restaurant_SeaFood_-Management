import React, { useEffect, useState } from "react";
import { Button, Form, Container } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import UserForm from "./UserForm";
import "../css/UserForm.css";

const API_URL = "http://localhost:9999/employees";

const EditEmployee = () => {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        age: "",
        address: "",
        email: "",
        gender: "",
        role: "staff",
        password: ""
    });
    const { id } = useParams();
    const navigate = useNavigate();



    useEffect(() => {
        const fetchEmployee = async () => {
            const res = await axios.get(`${API_URL}/${id}`);
            setFormData(res.data);
        };
        fetchEmployee();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { name, phone, age, address, email, password } = formData;

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

        if (!address.trim()) {
            alert("Địa chỉ không được để trống");
            return;
        }

        if (!email.trim()) {
            alert("Email không được để trống");
            return;
        }

        if (!password.trim()) {
            alert("Mật khẩu không được để trống");
            return;
        }

        try {
            await axios.put(`${API_URL}/${id}`, {
                ...formData,
                age: Number(age)
            });
            alert("Cập nhật nhân viên thành công!");
            navigate("/admin/employees");
        } catch (error) {
            console.error("Lỗi khi cập nhật nhân viên:", error);
            alert("Cập nhật thất bại");
        }
    };


    return (
        <div className="user-page">
            <Container className="user-form-container bg-dark-2">
                <h4>Chỉnh sửa nhân viên</h4>
                <Form onSubmit={handleSubmit}>
                    <UserForm formData={formData} handleChange={handleChange} isEdit={true} />
                    <Button type="submit" style={{ cursor: "pointer" }}>Cập nhật</Button>
                </Form>
            </Container>
        </div>
    );
};

export default EditEmployee;
