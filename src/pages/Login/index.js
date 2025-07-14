import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ phone: '', password: '' });
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidated(true);

    const { phone, password } = formData;
    if (!phone || !password) {
      setError('Please fill in all fields');
      return;
    }
    navigate('/admin/dashboard');

    // Fake login logic - replace with actual API call
    if (phone === 'admin@example.com' && password === 'admin123') {
      navigate('/');
    } else {
      setError('Invalid phone or password');
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <Row className="w-100 justify-content-center">
        <Col md={6} lg={5}>
          <Card className="shadow-lg">
            <Card.Body>
              <h3 className="text-center mb-4">Login to Harbor Fresh</h3>
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
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid phone number.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    required
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter your password.
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button variant="danger" type="submit" className="rounded-pill">
                    Login
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
