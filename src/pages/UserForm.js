// components/UserForm.js
import React from "react";
import { Form } from "react-bootstrap";

const UserForm = ({ formData, handleChange, isEdit = false }) => {
    return (
        <>
            <Form.Group className="mb-3">
                <Form.Label style={{ marginRight: "10px" }}>Tên: </Form.Label>
                <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label style={{ marginRight: "10px" }}>Vai trò: </Form.Label>
                <Form.Select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                >
                    <option value="admin">Admin</option>
                    <option value="staff">Nhân viên</option>
                </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label style={{ marginRight: "10px" }} >Số điện thoại: </Form.Label>
                <Form.Control
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                />
            </Form.Group>
            {
                !isEdit && (
                    <Form.Group className="mb-3">
                        <Form.Label style={{ marginRight: "10px" }}>Mật khẩu: </Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                )
            }
        </>
    );
};

export default UserForm;
