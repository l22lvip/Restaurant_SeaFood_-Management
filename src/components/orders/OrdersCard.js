import React, { useEffect, useState } from 'react'
import { Row } from 'react-bootstrap'
import { FaCheckDouble, FaCircle } from 'react-icons/fa'
import './css/OrdersCard.css'
import axios from 'axios'

const OrdersCard = ({ order, userId }) => {

    // Khởi tạo user là null để kiểm tra trạng thái tải dễ dàng hơn
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (userId) {
            axios.get(`http://localhost:9999/users/${userId}`)
                .then(response => {
                    setUser(response.data);
                })
                .catch(err => {
                    console.log("Failed to fetch user with axios:", err);
                });
        }
    }, [userId]);

    // Tính tổng số lượng mặt hàng trong đơn hàng
    const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

    // Chuyển đổi timestamp thành định dạng ngày và giờ có thể đọc được
    const formatDateTime = (timestamp) => {
        const date = new Date(timestamp);
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        };
        return date.toLocaleString('vi-VN', options).replace(',', '');
    };

    // Lấy chữ cái đầu của tên người dùng
    const getInitials = (name) => {
        if (!name) return '';
        const nameArray = name.split(' ');
        return nameArray.map(n => n[0]).join('').toUpperCase();
    }

    return (
        <Row className='order-card'>
            <Row className='order-card-1'>
                <button className='order-card-button'>
                    {/* Chỉ hiển thị chữ cái đầu khi user đã được tải */}
                    {user ? getInitials(user.name) : ''}
                </button>
                <Row className='order-card-content'>
                    <Row className='order-card-content-1'>
                        {/* Hiển thị tên người dùng hoặc chữ 'Loading...' nếu chưa có */}
                        <h1>{user ? user.name : 'Đang tải...'}</h1>
                        <p>#{order.id}</p>
                    </Row>
                    <Row className='order-card-content-2'>
                        <p className='order-card-ready'><FaCheckDouble className='order-card-ready-icon' /> {order.status}</p>
                        <p className='order-card-serve'><FaCircle className='order-card-serve-icon' />Sẵn sàng phục vụ</p>
                    </Row>
                </Row>
            </Row>
            <Row className='order-card-2' >
                <p>{formatDateTime(order.timestamp)}</p>
                <p>{totalItems} Món</p>
            </Row>
            <hr className='order-card-hr' />
            <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 className='order-card-total' style={{ color: '#f5f5f5' }}>Tổng cộng: </h3>
                {/* Chuyển đổi định dạng tiền tệ cho dễ đọc hơn */}
                <p className='order-card-price' style={{ color: '#f5f5f5' }}>
                    {new Intl.NumberFormat('vi-VN').format(order.total)}₫
                </p>
            </Row>
        </Row>
    )
}

export default OrdersCard;