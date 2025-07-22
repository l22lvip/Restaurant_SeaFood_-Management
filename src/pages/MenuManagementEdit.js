import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { BiLoaderAlt } from 'react-icons/bi';

export default function MenuManagementEdit() {
    const [form, setForm] = useState({ name: '', price: '', imageUrl: '', description: '', categoryId: '' });
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const uploadImageToImgbb = async (file) => {
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
            reader.onloadend = async () => {
                const base64 = reader.result.split(',')[1];
                try {
                    const formData = new URLSearchParams();
                    formData.append('key', 'f9ae9117ab595c982d21d625abd11582');
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


    useEffect(() => {
        // Lấy danh sách category từ API    
        axios.get('http://localhost:9999/categories')
            .then(res => setCategories(res.data))
            .catch(() => setCategories([]));
    }, []);

    useEffect(() => {
        // Lấy thông tin món ăn theo id
        axios.get(`http://localhost:9999/menuItems/${id}`)
            .then(res => {
                setForm({
                    name: res.data.name || '',
                    price: res.data.price || '',
                    imageUrl: res.data.imageUrl || '',
                    description: res.data.description || '',
                    categoryId: res.data.categoryId ? String(res.data.categoryId) : ''
                });
            })
            .catch(() => setError('Không tìm thấy món ăn.'));
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        setLoading(true);
        if (!form.name || !form.price || !form.description || !form.categoryId) {
            setError('Vui lòng nhập đầy đủ thông tin.');
            return;
        }

        try {
            let imageUrl = form.imageUrl;
            if (imageFile) {
                imageUrl = await uploadImageToImgbb(imageFile);
            }

            await axios.put(`http://localhost:9999/menuItems/${id}`, {
                ...form,
                imageUrl,
                price: Number(form.price),
                categoryId: Number(form.categoryId)
            });

            setSuccess(true);
            setTimeout(() => navigate('/admin/menu-management   '), 1000);
        } catch (err) {
            setError('Có lỗi xảy ra khi cập nhật món.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <Container style={{ maxWidth: 500, margin: 'auto', marginTop: 40, background: '#222', padding: 32, borderRadius: 16 }}>
            <h2 style={{ color: '#f5f5f5', marginBottom: 24 }}>Chỉnh sửa món ăn</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <p style={{ color: 'red' }}>
                {error && <Alert variant="danger">{error}</Alert>}

            </p>
            {success && <Alert variant="success">Cập nhật món thành công!</Alert>}
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
                <Button variant="warning" type="submit">Cập nhật {loading && <BiLoaderAlt style={{ marginLeft: 10, width: 10, height: 10 }} className={'spinning'}></BiLoaderAlt>}</Button>
                <Button variant="secondary" style={{ marginLeft: 12 }} onClick={() => navigate('/admin/menu-management')}>Hủy</Button>
            </Form>
        </Container>
    );
} 