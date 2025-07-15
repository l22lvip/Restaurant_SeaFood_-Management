import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import logo from '../../assets/images/logo.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ phone: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { phone, password } = formData;
    if (!phone || !password) {
      setError('Please fill in all fields');
      return;
    }
    toast.success('Login successful! Redirecting to dashboard...');
    navigate('/staff');
    
    // Fake login logic - replace with actual API call
    if (phone === 'admin@example.com' && password === 'admin123') {
      navigate('/');
    } else {
      setError('Invalid phone or password');
    }
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
                <h3 className="text-center mb-4" style={{ fontWeight: 700, letterSpacing: 1 }}>Login to Harbor Fresh</h3>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form noValidate onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formLogin">
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
                  <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <div style={{ position: 'relative' }}>
                      <Form.Control
                        required
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Password"
                        value={formData.password}
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
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div style={{ flex: 1, height: 1, background: '#eee' }} />
                    <span style={{ margin: '0 12px', color: '#bbb', fontSize: 14 }}>or</span>
                    <div style={{ flex: 1, height: 1, background: '#eee' }} />
                  </div>
                  <Link to="/register" className="d-block me-2 mb-3 text-end" style={{ color: '#dc3545', fontWeight: 500 }}>
                    Register?
                  </Link>
                  <div className="d-grid gap-2">
                    <Button variant="danger" type="submit" className="rounded-pill" style={{ fontWeight: 600, fontSize: 18, padding: '0.75rem' }}>
                      Login
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

export default LoginPage;
