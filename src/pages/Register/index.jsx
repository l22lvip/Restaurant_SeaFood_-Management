import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import logo from '../../assets/images/logo.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({});
    const [error, setError] = useState('');
    const [maxID, setMaxID] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [showRePassword, setShowRePassword] = useState(false);
    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    useEffect(() => {
        axios.get('http://localhost:9999/users')
            .then(response => response.data.forEach(element => {
                if (element.id > maxID) {
                    setMaxID(element.id);
                }
            }));
    }, [maxID])


    const handleSubmit = async (e) => {
        e.preventDefault();
        const { phone, newpassword, repassword } = formData;
        if (!phone || !newpassword) {
            setError('Please fill in all fields');
            return;
        }
        if (phone.length < 10) {
            setError('Phone number must be at least 10 digits');
            return;
        }
        if (newpassword !== repassword) {
            setError('Passwords do not match');
            return;
        }

        await axios.post('http://localhost:9999/users', {
            id: (1 + parseInt(maxID)).toString(),
            phone,
            name: "",
            role: "",
            password: newpassword,
        })
        toast.success('Registration successful! Please log in.');
        await navigate('/login');
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f8f9fa 0%, #ffe5e5 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
                <Row className="w-100 justify-content-center">
                    <Col md={6} lg={5}>
                        <div style={{ textAlign: 'center', marginBottom: 24 }}>
                            <img src={logo} alt="Logo" style={{ width: 80, height: 80, objectFit: 'contain', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }} />
                        </div>
                        <Card className="shadow-lg border-0" style={{ borderRadius: 24, background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)', boxShadow: '0 8px 32px rgba(220,53,69,0.12)' }}>
                            <Card.Body style={{ padding: '2.5rem' }}>
                                <h3 className="text-center mb-4" style={{ fontWeight: 700, letterSpacing: 1 }}>Register to Harbor Fresh</h3>
                                {error && <Alert variant="danger">{error}</Alert>}
                                <Form noValidate onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3" controlId="formRegister">
                                        <Form.Label>Phone Number</Form.Label>
                                        <Form.Control
                                            required
                                            type="text"
                                            name="phone"
                                            placeholder="Enter phone number"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            style={{ borderRadius: 12, padding: '0.75rem', fontSize: 16 }}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Please provide a valid phone number.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formNewPassword">
                                        <Form.Label>New Password</Form.Label>
                                        <div style={{ position: 'relative' }}>
                                            <Form.Control
                                                required
                                                type={showPassword ? 'text' : 'password'}
                                                name="newpassword"
                                                placeholder="Enter new password"
                                                value={formData.newpassword}
                                                onChange={handleChange}
                                                style={{ borderRadius: 12, padding: '0.75rem', fontSize: 16, paddingRight: 40 }}
                                            />
                                            <span
                                                onClick={() => setShowPassword(s => !s)}
                                                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#aaa', fontSize: 18 }}
                                                tabIndex={0}
                                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                            >
                                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                                            </span>
                                        </div>
                                        <Form.Control.Feedback type="invalid">
                                            Please enter your password.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formRePassword">
                                        <Form.Label>Enter New Password Again</Form.Label>
                                        <div style={{ position: 'relative' }}>
                                            <Form.Control
                                                required
                                                type={showRePassword ? 'text' : 'password'}
                                                name="repassword"
                                                placeholder="Enter new password again"
                                                value={formData.repassword}
                                                onChange={handleChange}
                                                style={{ borderRadius: 12, padding: '0.75rem', fontSize: 16, paddingRight: 40 }}
                                            />
                                            <span
                                                onClick={() => setShowRePassword(s => !s)}
                                                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#aaa', fontSize: 18 }}
                                                tabIndex={0}
                                                aria-label={showRePassword ? 'Hide password' : 'Show password'}
                                            >
                                                {showRePassword ? <FaEyeSlash /> : <FaEye />}
                                            </span>
                                        </div>
                                        <Form.Control.Feedback type="invalid">
                                            Please re-enter your password.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                        <div style={{ flex: 1, height: 1, background: '#eee' }} />
                                        <span style={{ margin: '0 12px', color: '#bbb', fontSize: 14 }}>or</span>
                                        <div style={{ flex: 1, height: 1, background: '#eee' }} />
                                    </div>
                                    <Link to="/login" className="d-block me-2 mb-3 text-end" style={{ color: '#dc3545', fontWeight: 500 }}>
                                        Login?
                                    </Link>
                                    <div className="d-grid gap-2">
                                        <Button variant="danger" type="submit" className="rounded-pill" style={{ fontWeight: 600, fontSize: 18, padding: '0.75rem' }}>
                                            Register
                                        </Button>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default RegisterPage;
