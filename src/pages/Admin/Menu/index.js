import React, { useEffect, useState } from 'react';
import {
  Container, Row, Col, Table, Button, Form, Card, Modal, InputGroup
} from 'react-bootstrap';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { BiSearch } from 'react-icons/bi';

const API_URL = 'http://localhost:9999/menuItems';
const CATEGORY_URL = 'http://localhost:9999/categories';

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    imageFile: null,
    categoryId: ''
  });


  const [searchTerm, setSearchTerm] = useState('');

  const fetchMenuItems = async () => {
    try {
      let url = API_URL;
      if (selectedCategory) {
        url += `?categoryId=${selectedCategory}`;
      }

      const res = await axios.get(url);
      let items = res.data;

      if (searchTerm.trim() !== '') {
        const lowerSearch = searchTerm.toLowerCase();
        items = items.filter(item =>
          item.name.toLowerCase().includes(lowerSearch)
        );
      }

      setMenuItems(items);
    } catch (err) {
      console.error('Error fetching menu items:', err);
    }
  };


  const fetchCategories = async () => {
    try {
      const res = await axios.get(CATEGORY_URL);
      setCategories(res.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  console.log("menuItems", menuItems)

  useEffect(() => {
    fetchMenuItems();


  }, [searchTerm, selectedCategory]);




  const handleShow = (mode, item = null) => {
    setModalMode(mode);
    setFormData(
      item || {
        id: '',
        name: '',
        description: '',
        price: '',
        imageUrl: '',
        categoryId: ''
      }
    );
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
    });

  const uploadImageToImgBB = async (file) => {
    const base64 = await toBase64(file);
    const formData = new URLSearchParams();
    formData.append('key', 'f9ae9117ab595c982d21d625abd11582'); // thay bằng key của bạn
    formData.append('image', base64);

    const res = await axios.post('https://api.imgbb.com/1/upload', formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return res.data.data.url;
  };


  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, imageFile: e.target.files[0] }));
  };


  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchMenuItems();
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = formData.imageUrl;

    try {
      if (formData.imageFile) {
        imageUrl = await uploadImageToImgBB(formData.imageFile);
      }

      const data = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        imageUrl,
        categoryId: Number(formData.categoryId)
      };

      if (modalMode === 'add') {
        await axios.post(API_URL, data);
      } else {
        await axios.put(`${API_URL}/${formData.id}`, data);
      }

      fetchMenuItems();
      handleClose();
    } catch (err) {
      console.error('Submit failed:', err);
    }
  };


  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Quản lý thực đơn</h2>
        <Button variant="danger" className="rounded-pill" onClick={() => handleShow('add')}>
          + Thêm món ăn
        </Button>
      </div>
      <InputGroup className="mb-3" style={{ maxWidth: '300px' }}>
        <InputGroup.Text><BiSearch></BiSearch></InputGroup.Text>
        <Form.Control
          type="text"
          placeholder="Tìm theo tên..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
        />
      </InputGroup>


      <div className="mb-4 d-flex gap-2 flex-wrap">
        <Button
          variant={!selectedCategory ? 'primary' : 'outline-primary'}
          onClick={() => {
            setSelectedCategory('');
          }}
        >
          Tất cả
        </Button>
        {categories?.map(cat => (
          <Button
            key={cat.id}
            variant={selectedCategory === String(cat.id) ? 'primary' : 'outline-primary'}
            onClick={() => {
              setSelectedCategory(String(cat.id));
            }}
          >
            {cat.name}
          </Button>
        ))}
      </div>


      <Row className="g-4">
        {menuItems?.map(item => (
          <Col lg={4} md={6} key={item.id}>
            <Card className="h-100 shadow-sm">
              <Card.Img src={item.imageUrl} alt={item.name} />
              <Card.Body>
                <Card.Title>{item.name}</Card.Title>
                <Card.Text>{item.description}</Card.Text>
                <h5 className="text-danger">{item.price.toLocaleString()}₫</h5>
              </Card.Body>
              <Card.Footer className="d-flex justify-content-end gap-2">
                <Button variant="warning" size="sm" onClick={() => handleShow('edit', item)}>
                  <FaEdit />
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(item.id)}>
                  <FaTrash />
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>


      {/* Modal */}
      <Modal
        style={{ backdropFilter: 'blur(2px)' }}
        show={showModal} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalMode === 'add' ? 'Add New Menu Item' : 'Edit Menu Item'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">

                  {formData.imageFile ? (
                    <div className="d-flex flex-column align-items-center mt-2">
                      <img
                        src={URL.createObjectURL(formData.imageFile)}
                        alt="Preview"
                        style={{ height: 100, marginTop: 10 }}
                      />

                    </div>
                  ) : (
                    formData.imageUrl && (
                      <div className="d-flex flex-column align-items-center mt-2">
                        <img
                          src={formData.imageUrl}
                          alt="Current"
                          style={{ height: 100, marginTop: 10 }}
                        />
                        <p className="text-muted">Ảnh hiện tại</p>
                      </div>
                    )
                  )}
                  <Form.Label>Ảnh</Form.Label>

                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </Form.Group>

              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tên món ăn</Form.Label>
                  <Form.Control
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Giá</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    min={0}
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Danh mục</Form.Label>
              <Form.Select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
              >
                <option value="">-- Chọn danh mục --</option>
                {categories?.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" variant="danger" className="rounded-pill">
                {modalMode === 'add' ? 'Add Item' : 'Save Changes'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default MenuManagement;
