import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import '../components/home/css/PopularDishes.css';
import { useNavigate } from 'react-router-dom';

export default function Menu() {
    const [menuItems, setMenuItems] = useState([]);
    const [newItem, setNewItem] = useState({ name: '', price: '', imageUrl: '' });
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:9999/menuItems')
            .then(res => setMenuItems(res.data))
            .catch(err => console.log(err));
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewItem({ ...newItem, [name]: value });
    };
    const handleAddItem = (e) => {
        e.preventDefault();
        if (!newItem.name || !newItem.price || !newItem.imageUrl) return;
        axios.post('http://localhost:9999/menuItems', {
            ...newItem,
            price: Number(newItem.price)
        })
        .then(res => {
            setMenuItems([...menuItems, res.data]);
            setNewItem({ name: '', price: '', imageUrl: '' });
        })
        .catch(err => console.log(err));
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h1 style={{ color: '#f5f5f5', marginBottom: '2rem' }}>Menu</h1>
            <Form style={{ marginBottom: '2rem', background: '#222', padding: '1rem', borderRadius: '1rem' }}>
                <Button variant="warning" type="button" onClick={() => navigate('/admin/menu-management/create')}>Thêm món</Button>
            </Form>
            <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                {menuItems.map((item) => (
                    <Col key={item.id} className="d-flex">
                        <Card style={{ width: '100%', background: '#1a1a1a', color: '#f5f5f5', border: 'none', borderRadius: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                            <Card.Img variant="top" src={item.imageUrl} alt={item.name} style={{ height: '180px', objectFit: 'cover', borderTopLeftRadius: '1rem', borderTopRightRadius: '1rem' }} />
                            <Card.Body>
                                <Card.Title style={{ fontWeight: 600 }}>{item.name}</Card.Title>
                                <Card.Text style={{ fontSize: '1.1rem', color: '#f6b100', fontWeight: 500 }}>
                                    {item.price ? `${item.price.toLocaleString('vi-VN')} đ` : ''}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
}