import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container, Row, Col, Table, Button, Modal, Form, InputGroup,
  Spinner
} from 'react-bootstrap';
import { FaUserPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

import { toast } from 'react-toastify';
import { VscLoading } from 'react-icons/vsc';


const API_URL = 'http://localhost:9999/users';

const EmployeeManagement = () => {
  const [allEmployees, setAllEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    role: '',
    password: '',
    avatarFile: null,
    imageUrl: '',
  });
  const [searchTerm, setSearchTerm] = useState('');

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(API_URL);
      setAllEmployees(response.data);
    } catch (error) {
      console.error('Lỗi lấy danh sách nhân viên:', error);
    }
  };


  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();
    const filtered = allEmployees.filter(emp =>
      emp.name.toLowerCase().includes(lowerSearch) ||
      emp.phone.toLowerCase().includes(lowerSearch)
    );
    setFilteredEmployees(filtered);
  }, [searchTerm, allEmployees]);

  const handleShow = (mode, employee = null) => {
    setModalMode(mode);
    setFormData(employee || { name: '', phone: '', role: '', password: '', imageUrl: '', imageFile: null });
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const [loading, setLoading] = useState(false);

  const uploadImageToImgBB = async (file) => {
    const base64 = await toBase64(file);
    const formData = new URLSearchParams();

    formData.append('key', 'f9ae9117ab595c982d21d625abd11582');  // img bb API key của thái

    formData.append('image', base64);

    const res = await axios.post('https://api.imgbb.com/1/upload', formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return res.data.data.url;
  };

  // Chuyển file thành base64
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]); // chỉ lấy phần base64, bỏ "data:image/..."
      reader.onerror = reject;
    });


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = formData.imageUrl || '';

      if (formData.avatarFile) {
        imageUrl = await uploadImageToImgBB(formData.avatarFile);
      }

      const submitData = {
        name: formData.name,
        phone: formData.phone,
        role: formData.role,
        password: formData.password,
        imageUrl,
      };

      if (modalMode === 'add') {
        await axios.post(API_URL, submitData);
      } else {
        await axios.put(`${API_URL}/${formData.id}`, submitData);
      }
      toast.success(`${modalMode === 'add' ? 'Thêm' : 'Cập nhật'} nhân viên thành công!`);
      setFormData({
        name: '',
        phone: '',
        role: '',
        password: '',
        imageUrl: '',
        avatarFile: null,
      })

      handleClose();
      fetchEmployees();
    } catch (error) {
      toast.error('Lỗi lưu nhân viên. Vui lòng thử lại.');
      console.error('Lỗi:', error);
    } finally {
      setLoading(false);
    }
  };



  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchEmployees();
      } catch (error) {
        console.error('Lỗi xóa nhân viên:', error);
      }
    }
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h2 className="mb-0">Employee Management</h2>

        <InputGroup style={{ maxWidth: '300px' }}>
          <InputGroup.Text><FaSearch /></InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Search by name or phone"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>

        <Button variant="danger" className="rounded-pill" onClick={() => handleShow('add')}>
          <FaUserPlus className="me-2" />
          Thêm nhân viên
        </Button>
      </div>

      <Table striped bordered hover responsive className="shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>Avatar</th>
            <th>Tên</th>
            <th>Vai trò</th>
            <th>Số điện thoại</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center text-muted">No employees found</td>
            </tr>
          ) : (
            filteredEmployees.map(employee => (
              <tr key={employee.id}>
                <td>
                  <img style={{ width: '50px', height: '50px' }} src={employee.imageUrl || 'https://placehold.jp/50x50/333333/FFFFFF?text=Nhân+Viên'} alt={employee.name} className="avatar" />
                </td>
                <td>{employee.name}</td>
                <td className="text-capitalize">{employee.role}</td>
                <td>{employee.phone}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => handleShow('edit', employee)}
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(employee.id)}
                  >
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* Modal */}
      <Modal show={showModal} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalMode === 'add' ? 'Thêm nhân viên mới' : 'Chỉnh sửa nhân viên'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Avatar</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setFormData(prev => ({ ...prev, avatarFile: e.target.files[0] }))
                    }
                  />
                </Form.Group>

              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Select
                    name="role"
                    required
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="">-- Chọn vai trò --</option>
                    <option value="Bồi bàn">Nhân viên phục vụ</option>
                    <option value="Đầu Bếp">Đầu bếp</option>
                    <option value="Quản lý">Quản lý</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Mật khẩu</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    required={modalMode === 'add'}
                    placeholder={modalMode === 'edit' ? 'Leave blank to keep current password' : ''}
                    value={formData.password}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={handleClose}>
                Hủy
              </Button>
              <Button variant="danger" type="submit" className=" rounded-pill">
                {modalMode === 'add' ? 'Thêm nhân viên' : 'Lưu thay đổi'}
                {loading &&
                  <Spinner animation="border" role="status" size='sm' className='ms-2'>
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                }

              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default EmployeeManagement;
