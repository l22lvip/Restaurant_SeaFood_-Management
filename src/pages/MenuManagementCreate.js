import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function MenuManagementCreate() {
    const [form, setForm] = useState({ name: '', price: '', description: '', categoryId: '' });
    const [imageFile, setImageFile] = useState(null);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:9999/categories')
            .then(res => setCategories(res.data))
            .catch(() => setCategories([]));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const uploadImageToImgbb = async (file) => {
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
            reader.onloadend = async () => {
                const base64 = reader.result.split(',')[1];
                try {
                    const formData = new URLSearchParams();
                    formData.append('key', 'YOUR_IMGBB_API_KEY'); // 🔁 Thay bằng API key thực tế
                    formData.append('image', base64);

                    const res = await axios.post(
                        'https://api.imgbb.com/1/upload',
                        formData.toString(),
                        {
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                            },
                        }
                    );
                    resolve(res.data.data.url);
                } catch (error) {
                    reject(error);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        if (!form.name || !form.price || !form.description || !form.categoryId || !imageFile) {
            setError('Vui lòng nhập đầy đủ thông tin và chọn ảnh.');
            return;
        }

        try {
            const imageUrl = await uploadImageToImgbb(imageFile);

            await axios.post('http://localhost:9999/menuItems', {
                ...form,
                imageUrl,
                price: Number(form.price),
                categoryId: Number(form.categoryId)
            });

            setSuccess(true);
            setTimeout(() => navigate('/admin/menu-management'), 1000);
        } catch (err) {
            setError('Có lỗi xảy ra khi thêm món.');
        }
    };

    return (
        <Container style={{ maxWidth: 500, margin: 'auto', marginTop: 40, background: '#222', padding: 32, borderRadius: 16 }}>
            <h2 style={{ color: '#f5f5f5', marginBottom: 24 }}>Thêm món mới</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">Thêm món thành công!</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label style={{ color: '#f5f5f5' }}>Tên món</Form.Label>
                    <Form.Control name="name" value={form.name} onChange={handleChange} placeholder="Nhập tên món" />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label style={{ color: '#f5f5f5' }}>Giá</Form.Label>
                    <Form.Control name="price" value={form.price} onChange={handleChange} placeholder="Nhập giá" type="number" />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label style={{ color: '#f5f5f5' }}>Chọn ảnh</Form.Label>
                    <Form.Control type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label style={{ color: '#f5f5f5' }}>Mô tả</Form.Label>
                    <Form.Control name="description" value={form.description} onChange={handleChange} placeholder="Nhập mô tả món" as="textarea" rows={2} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label style={{ color: '#f5f5f5' }}>Loại món</Form.Label>
                    <Form.Select name="categoryId" value={form.categoryId} onChange={handleChange}>
                        <option value="">Chọn loại món</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </Form.Select>
                </Form.Group>
                <Button variant="warning" type="submit" style={{ cursor: 'pointer' }}>Thêm món</Button>
                <Button variant="secondary" style={{ marginLeft: 12, cursor: 'pointer' }} onClick={() => navigate('/admin/menu-management')}>Hủy</Button>
            </Form>
        </Container>
    );
}
