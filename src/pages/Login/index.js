import React, { useState } from 'react'
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const LoginPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ phone: '', password: '' })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const { phone, password } = formData
    if (!phone || !password) {
      setError('Vui lòng nhập đầy đủ thông tin')
      return
    }

    try {
      const res = await axios.get(`http://localhost:9999/users`, {
        params: { phone, password }
      })

      const user = res.data[0]

      if (!user) {
        setError('Số điện thoại hoặc mật khẩu không chính xác')
        return
      }

      localStorage.setItem('user', JSON.stringify(user))

      if (user) {
        navigate('/staff')
      }

    } catch (err) {
      console.error(err)
      setError('Đã xảy ra lỗi, vui lòng thử lại sau')
    }
  }

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <Row className="w-100 justify-content-center">
        <Col md={6} lg={5}>
          <Card className="shadow-lg">
            <Card.Body>
              <h3 className="text-center mb-4">Đăng nhập vào Harbor Fresh</h3>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Số điện thoại</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    placeholder="Nhập số điện thoại"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Mật khẩu</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Mật khẩu"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button variant="danger" type="submit" className="rounded-pill">
                    Đăng nhập
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default LoginPage
