import { useContext, useEffect, useState } from 'react'
import { Container, Row, Col, Form, Button, Spinner, Card } from 'react-bootstrap'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../components/shared/UserContext'

const API_URL = 'http://localhost:9999/users'

const Profile = () => {

  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    imageUrl: '',
    avatarFile: null,
  })
  const [loading, setLoading] = useState(false)

  const { userProfile, fetchProfile } = useContext(UserContext)

  useEffect(() => {
    // const fetchUser = async () 
    setFormData(userProfile ? {
      name: userProfile.name,
      phone: userProfile.phone,
      password: '',
      imageUrl: userProfile.imageUrl,
      avatarFile: null,
    } : {})
  }, [userProfile])

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result.split(',')[1])
      reader.onerror = reject
    })

  const uploadImageToImgBB = async (file) => {
    const base64 = await toBase64(file)
    const formData = new URLSearchParams()
    formData.append('key', 'f9ae9117ab595c982d21d625abd11582')
    formData.append('image', base64)

    const res = await axios.post('https://api.imgbb.com/1/upload', formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })

    return res.data.data.url
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      let imageUrl = formData.imageUrl

      if (formData.avatarFile) {
        imageUrl = await uploadImageToImgBB(formData.avatarFile)
      }

      const submitData = {
        ...userProfile,
        name: formData.name,
        phone: formData.phone,
        imageUrl,
      }

      if (formData.password) {
        submitData.password = formData.password
      }

      await axios.put(`${API_URL}/${userProfile.id}`, submitData)
      toast.success('Cập nhật hồ sơ thành công!')
      fetchProfile()
      // fetchUser()
    } catch (error) {
      toast.error('Lỗi khi cập nhật hồ sơ')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/login')
    toast.success('Đăng xuất thành công!')
  }

  if (!userProfile) return <p className="text-center mt-5">Đang tải dữ liệu...</p>

  return (
    <Container className="py-4">
      <h2>Thông tin cá nhân</h2>
      <Card className="p-4 shadow-sm">
        <Form onSubmit={handleSubmit}>
          <Row className="align-items-center">
            <Col md={3} className="text-center mb-3">
              <img
                src={formData.avatarFile ? URL.createObjectURL(formData.avatarFile) : (formData.imageUrl || 'https://placehold.jp/100x100/cccccc/ffffff?text=Avatar')}
                alt="avatar"
                className="rounded-circle"
                style={{ width: 100, height: 100, objectFit: 'cover' }}
              />
              <Form.Control
                type="file"
                size='sm'
                accept="image/*"
                onChange={(e) => setFormData(prev => ({ ...prev, avatarFile: e.target.files[0] }))}
                className="mt-2"
              />
            </Col>
            <Col md={9}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tên</Form.Label>
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
                    <Form.Label>Số điện thoại</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      required
                      disabled
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Mật khẩu mới</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Để trống nếu không đổi"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Vai trò</Form.Label>
                    <Form.Control
                      type="text"
                      value={userProfile.role}
                      disabled
                    />
                  </Form.Group>
                </Col>
              </Row>
              <div className='d-flex justify-content-between'>
                <Button type="submit" variant="danger" className="rounded-pill">
                  Lưu thay đổi
                  {loading && (
                    <Spinner size="sm" animation="border" className="ms-2" />
                  )}
                </Button>
                <Button type="button" variant="outline-danger" className="rounded-pill" onClick={handleLogout}>
                  Đăng xuất
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </Card>
    </Container>
  )
}

export default Profile
