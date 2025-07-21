import React, { useEffect, useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import '../css/Orders.css';
import OrdersCard from '../components/orders/OrdersCard';

const Orders = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [orders, setOrders] = useState([]);
  // Thêm state để quản lý người dùng, tối ưu hiệu suất
  const [users, setUsers] = useState({});

  useEffect(() => {
    fetch('http://localhost:9999/orders')
      .then(res => res.json())
      .then(allOrders => {
        // Lọc đơn hàng
        const filteredOrders = allOrders.filter(order => {
          if (activeFilter === 'all') {
            return true;
          }
          // Chuyển trạng thái về chữ thường và bỏ khoảng trắng để so sánh
          const status = order.status.toLowerCase().replace(/\s/g, '');
          return status === activeFilter;
        });
        setOrders(filteredOrders);

        // Lấy thông tin người dùng liên quan để tránh gọi API lặp lại
        const userIds = [...new Set(allOrders.map(order => order.userId))];
        Promise.all(
          userIds.map(id => fetch(`http://localhost:9999/users/${id}`).then(res => res.json()))
        ).then(usersData => {
          const usersMap = usersData.reduce((acc, user) => {
            acc[user.id] = user;
            return acc;
          }, {});
          setUsers(usersMap);
        });
      })
      .catch(err => console.log(err));
  }, [activeFilter]);

  const getButtonClass = (filter) => {
    return filter === activeFilter ? 'orders-filter-active' : 'orders-filter-inactive';
  };

  return (
    <Container className='orders' style={{ paddingBottom: '100px' }}>
      <Row className='orders-header'>
        <h1 className='orders-title'>Orders</h1>
        <Row className='orders-filter'>
          <button onClick={() => setActiveFilter('all')} className={getButtonClass('all')}>All</button>
          {/* Sửa 1: Sửa giá trị filter cho "In Progress" */}
          <button onClick={() => setActiveFilter('inprogress')} className={getButtonClass('inprogress')}>In Progress</button>
          <button onClick={() => setActiveFilter('ready')} className={getButtonClass('ready')}>Ready</button>
          <button onClick={() => setActiveFilter('completed')} className={getButtonClass('completed')}>Completed</button>
        </Row>
      </Row>

      <Row style={{
        display: 'flex',
        flexWrap: 'wrap',
        // Sửa 2: Căn chỉnh các thẻ về bên trái
        justifyContent: 'flex-start',
        // Sửa 3: Sửa lại chiều cao tối đa để thanh cuộn hoạt động tốt
        maxHeight: 'calc(100vh - 12rem)', // Dành không gian cho header và filter
        overflowY: 'auto', // Đổi thành 'auto' để thanh cuộn chỉ xuất hiện khi cần
        scrollbarWidth: 'none',
        gap: '2rem', // Giảm khoảng cách một chút cho đẹp hơn
        padding: '1.5rem',
      }}>
        {orders.map(order => (
          // Truyền thông tin user đã lấy được xuống cho mỗi thẻ
          <OrdersCard key={order.id} userId={order.userId} order={order} user={users[order.userId]} />
        ))}
      </Row>
    </Container>
  );
};

export default Orders;