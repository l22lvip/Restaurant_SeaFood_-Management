import React, { useEffect, useState } from 'react';
import {
  Container, Row, Col, Table, Button, Form, Card, Modal, InputGroup
} from 'react-bootstrap';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';

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
    const data = {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      imageUrl: formData.imageUrl,
      categoryId: Number(formData.categoryId)
    };

    try {
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
        <h2>Menu Management</h2>
        <Button variant="danger" className="rounded-pill" onClick={() => handleShow('add')}>
          + Add Menu Item
        </Button>
      </div>
      <InputGroup className="mb-3" style={{ maxWidth: '300px' }}>
        <InputGroup.Text>🔍</InputGroup.Text>
        <Form.Control
          type="text"
          placeholder="Search by name..."
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
          All
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
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
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
                  <Form.Label>Price</Form.Label>
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
              <Form.Label>Description</Form.Label>
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
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Category --</option>
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
