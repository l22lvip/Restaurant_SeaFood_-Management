import React, { useEffect, useState } from "react";
import { Button, Form, Container } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import UserForm from "./UserForm";
import "../css/UserForm.css";


const EditUser = () => {
    const [userList, setUserList] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        role: "staff",
        phone: "",
        password: "",
    });
    const { id } = useParams();
    const navigate = useNavigate();


    useEffect(() => {
        const fetchUserList = async () => {
            const res = await axios.get(API_URL);
            setUserList(res.data);
        };
        fetchUserList();
    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            const res = await axios.get(`${API_URL}/${id}`);
            setFormData(res.data);
        };
        fetchUser();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { name, phone } = formData;

        if (!name.trim()) {
            alert("Tên không được để trống");
            return;
        }

        if (!/^\d{10}$/.test(phone)) {
            alert("Số điện thoại phải đủ 10 chữ số");
            return;
        }

        const user = userList.find(
            (user) => user.phone === phone && user.id !== id
        );
        if (user) {
            alert("Số điện thoại đã tồn tại");
            return;
        }

        try {
            await axios.put(`${API_URL}/${id}`, formData);
            navigate("/users");
        } catch (error) {
            console.error("Lỗi khi cập nhật người dùng:", error);
            alert("Cập nhật thất bại");
        }
    };


    return (
        <div className="user-page">
            <Container className="user-form-container bg-dark-2">
                <h4>Chỉnh sửa người dùng</h4>
                <Form onSubmit={handleSubmit}>
                    <UserForm formData={formData} handleChange={handleChange} isEdit={true} />
                    <Button type="submit" style={{ cursor: "pointer" }}>Cập nhật</Button>
                </Form>
            </Container>
        </div>
    );
};

export default EditUser;
