import React, { useState } from 'react';
import {
  Container, Row, Col, Table, Button, Form, Card, Modal, InputGroup
} from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';

const categories = [
  { id: '1', name: 'Khai vị' },
  { id: '2', name: 'Hải sản' },
  { id: '3', name: 'Món chính' },
  { id: '4', name: 'Tráng miệng' },
  { id: '5', name: 'Đồ uống' }
];

const initialMenuItems = [
  {
    id: '1',
    name: 'Gỏi cuốn tôm thịt',
    description: 'Gỏi cuốn tươi mát với tôm, thịt, bún và rau sống, dùng kèm nước chấm đậm đà.',
    price: 55000,
    imageUrl: 'https://placehold.co/600x400/333333/FFFFFF?text=Gỏi+Cuốn',
    categoryId: '1'
  },
  {
    id: '2',
    name: 'Cua sốt me',
    description: 'Cua biển tươi ngon được rang với sốt me chua ngọt đặc trưng.',
    price: 450000,
    imageUrl: 'https://placehold.co/600x400/333333/FFFFFF?text=Cua+Sốt+Me',
    categoryId: '2'
  },
  {
    id: '3',
    name: 'Tôm hùm nướng phô mai',
    description: 'Tôm hùm baby nướng với phô mai mozzarella béo ngậy.',
    price: 750000,
    imageUrl: 'https://placehold.co/600x400/333333/FFFFFF?text=Tôm+Hùm',
    categoryId: '2'
  },
  {
    id: '4',
    name: 'Lẩu Thái hải sản',
    description: 'Nồi lẩu chua cay đậm vị Thái với đầy đủ các loại hải sản tươi sống.',
    price: 350000,
    imageUrl: 'https://placehold.co/600x400/333333/FFFFFF?text=Lẩu+Thái',
    categoryId: '3'
  },
  {
    id: '5',
    name: 'Chè khúc bạch',
    description: 'Món tráng miệng thanh mát với thạch hạnh nhân, nhãn và vải.',
    price: 35000,
    imageUrl: 'https://placehold.co/600x400/333333/FFFFFF?text=Chè',
    categoryId: '4'
  },
  {
    id: '6',
    name: 'Nước chanh',
    description: 'Nước chanh tươi giải nhiệt.',
    price: 25000,
    imageUrl: 'https://placehold.co/600x400/333333/FFFFFF?text=Nước+Chanh',
    categoryId: '5'
  }
];

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState(initialMenuItems);
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

  const handleDelete = (id) => {
    if (window.confirm('Are you sure?')) {
      setMenuItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalMode === 'add') {
      setMenuItems(prev => [...prev, { ...formData, id: Date.now().toString() }]);
    } else {
      setMenuItems(prev =>
        prev.map(item => (item.id === formData.id ? formData : item))
      );
    }
    handleClose();
  };

  const filteredItems = selectedCategory
    ? menuItems.filter(item => item.categoryId === selectedCategory)
    : menuItems;

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Menu Management</h2>
        <Button variant="danger" className="rounded-pill" onClick={() => handleShow('add')}>
          + Add Menu Item
        </Button>
      </div>

      <div className="mb-4 d-flex gap-2 flex-wrap">
        <Button
          variant={!selectedCategory ? 'primary' : 'outline-primary'}
          onClick={() => setSelectedCategory('')}
        >
          All
        </Button>
        {categories.map(cat => (
          <Button
            key={cat.id}
            variant={selectedCategory === cat.id ? 'primary' : 'outline-primary'}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.name}
          </Button>
        ))}
      </div>

      <Row className="g-4">
        {filteredItems.map(item => (
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

      {/* Modal Thêm/Sửa */}
      <Modal show={showModal} onHide={handleClose} size="lg" centered>
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
                {categories.map(cat => (
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
