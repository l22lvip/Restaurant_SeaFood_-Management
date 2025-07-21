import React from 'react'
import './css/RecentOrders.css'; // Assuming you have a CSS file for styling
import { Row } from 'react-bootstrap'
import { FaSearch } from 'react-icons/fa';
import OrderList from './OrderList';

const RecentOrders = () => {
  return (
    <Row className='recent-orders-section'>
      <Row className='recent-orders-header'>
        <Row className='recent-orders-title'>
          <h1>Đơn hàng gần đây</h1>
          {/* <a href='/' className='view-all'>Xem tất cả</a> */}
        </Row>


        {/* <Row className='search-rencent-section'>
          <FaSearch className='search-rencent-icon' />
          <input
            type='text'
            className='search-rencent-input'
            placeholder='Rencent Orders Search...'
          />
        </Row> */}

        <Row className='order-list-section'>
          <OrderList />
          <OrderList />
          <OrderList />
          <OrderList />
          <OrderList />
          <OrderList />
          <OrderList />
        </Row>

      </Row>
    </Row>
  )
}

export default RecentOrders