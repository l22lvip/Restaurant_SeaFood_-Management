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

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xoá món này không?");
        if (!confirmDelete) return;
        try {
            await axios.delete(`http://localhost:9999/menuItems/${id}`);
            setMenuItems(menuItems.filter(item => item.id !== id));
        } catch (err) {
            console.log(err);
            alert("Xoá món thất bại!");
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h1 style={{ color: '#f5f5f5', marginBottom: '2rem' }}>Menu</h1>
            <Form style={{ marginBottom: '2rem', background: '#222', padding: '1rem', borderRadius: '1rem' }}>
                <Button variant="warning" type="button" onClick={() => navigate('/admin/menu-management/create')}>Thêm món</Button>
            </Form>
            <Row xs={2} className="g-4">
                {menuItems.map((item) => (
                    <Col key={item.id} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1rem' }}>
                        <Card style={{ display: 'flex', width: '50%', padding: '10px', background: '#1a1a1a', color: '#f5f5f5', border: 'none', borderRadius: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                            <Card.Img variant="top" src={item.imageUrl} alt={item.name} style={{ margin: '10px', height: '180px', objectFit: 'cover', borderRadius: '1rem', borderTopRightRadius: '1rem' }} />
                            <Card.Body>
                                <Card.Title style={{ fontWeight: 600,marginRight: '10px' }}>{item.name} </Card.Title>
                                <Card.Text style={{ fontSize: '1.1rem', color: '#f6b100', fontWeight: 500 }}>
                                    {item.price ? `${item.price.toLocaleString('vi-VN')} đ` : ''}
                                </Card.Text>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <Button
                                        variant="outline-info"
                                        size="sm"
                                        onClick={() => navigate(`/admin/menu-management/edit/${item.id}`)}
                                    >
                                        Sửa
                                    </Button>
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => handleDelete(item.id)}
                                    >
                                        Xoá
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
}