import React, { useState } from 'react';
import {
    Container, Row, Col, Table, Button, Modal, Form, InputGroup
} from 'react-bootstrap';
import { FaUserPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

const EmployeeManagement = () => {
    const [employees, setEmployees] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [formData, setFormData] = useState({
        name: '', phone: '', role: '', password: ''
    });
    const [searchTerm, setSearchTerm] = useState('');

    const handleShow = (mode, employee = null) => {
        setModalMode(mode);
        setFormData(employee || { name: '', phone: '', role: '', password: '' });
        setShowModal(true);
    };

    const handleClose = () => setShowModal(false);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (modalMode === 'add') {
            setEmployees(prev => [...prev, { ...formData, id: Date.now() }]);
        } else {
            setEmployees(prev =>
                prev.map(emp => (emp.id === formData.id ? formData : emp))
            );
        }
        handleClose();
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure?')) {
            setEmployees(prev => prev.filter(emp => emp.id !== id));
        }
    };

    // Lọc danh sách theo searchTerm
    const filteredEmployees = employees.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.phone.includes(searchTerm)
    );

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

                <Button variant="danger" onClick={() => handleShow('add')}>
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
            <Modal style={{ backdropFilter: 'blur(2px)' }}
                show={showModal}
                onHide={handleClose}
                size="lg"
                centered
            >
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
                                        <option value="waiter">Waiter</option>
                                        <option value="chef">Chef</option>
                                        <option value="admin">Admin</option>
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
                            <Button variant="danger" type="submit" >
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
