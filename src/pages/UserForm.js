import React from "react";
import { Form } from "react-bootstrap";

const UserForm = ({ formData, handleChange }) => {
  return (
    <>
      <Form.Group className="mb-3">
        <Form.Label>Họ và tên: </Form.Label>
        <Form.Control
          type="text"
          placeholder="Nhập tên"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Số điện thoại: </Form.Label>
        <Form.Control
          type="text"
          placeholder="Nhập số điện thoại"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Tuổi: </Form.Label>
        <Form.Control
          type="number"
          placeholder="Nhập tuổi"
          name="age"
          value={formData.age}
          onChange={handleChange}
          required
          min={18}
          max={60}
          style={{ width: "100px" }}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Địa chỉ: </Form.Label>
        <Form.Control
          type="text"
          placeholder="Nhập địa chỉ"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Email: </Form.Label>
        <Form.Control
          type="email"
          placeholder="Nhập email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Giới tính: </Form.Label>
        <Form.Select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
        >
          <option value="">Chọn giới tính</option>
          <option value="male">Nam</option>
          <option value="female">Nữ</option>
          <option value="other">Khác</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Vai trò: </Form.Label>
        <Form.Select
          name="role"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="staff">Nhân viên</option>
          <option value="admin">Quản lý</option>
        </Form.Select>
      </Form.Group>

      {/* <Form.Group className="mb-3">
        <Form.Label>Mật khẩu: </Form.Label>
        <Form.Control
          type="password"
          placeholder="Nhập mật khẩu"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </Form.Group> */}

      <Form.Group className="mb-3">
        <Form.Label>Lương: </Form.Label>
        <Form.Control
          type="number"
          placeholder="Nhập lương"
          name="salary"
          value={formData.salary}
          onChange={handleChange}
        />
      </Form.Group>
    </>
  );
};

export default UserForm;
