import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container, Row, Col, Table, Button, Modal, Form, InputGroup
} from 'react-bootstrap';
import { FaUserPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

const API_URL = 'http://localhost:9999/users';

const EmployeeManagement = () => {
  const [allEmployees, setAllEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [formData, setFormData] = useState({ name: '', phone: '', role: '', password: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(API_URL);
      setAllEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
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
    setFormData(employee || { name: '', phone: '', role: '', password: '' });
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'add') {
        await axios.post(API_URL, formData);
      } else {
        await axios.put(`${API_URL}/${formData.id}`, formData);
      }
      handleClose();
      fetchEmployees();
    } catch (error) {
      console.error('Error saving employee:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchEmployees();
      } catch (error) {
        console.error('Error deleting employee:', error);
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
          Add Employee
        </Button>
      </div>

      <Table striped bordered hover responsive className="shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Phone</th>
            <th>Actions</th>
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
      <Modal show={showModal} onHide={handleClose} size="lg" centered backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>
            {modalMode === 'add' ? 'Add New Employee' : 'Edit Employee'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
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
                    <option value="">-- Select Role --</option>
                    <option value="Bồi bàn">Waiter</option>
                    <option value="Đầu Bếp">Chef</option>
                    <option value="Quản lý">Admin</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
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
                Cancel
              </Button>
              <Button variant="danger" type="submit" className="rounded-pill">
                {modalMode === 'add' ? 'Add Employee' : 'Save Changes'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default EmployeeManagement;
