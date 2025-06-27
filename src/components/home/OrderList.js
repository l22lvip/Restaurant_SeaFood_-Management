import React from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import './css/OrderList.css'; // Assuming you have a CSS file for styling
import { FaCheckDouble, FaCircle } from 'react-icons/fa';

const OrderList = () => {
    return (
        <Row className='order-list-wrapper'>
            <button className='order-list-button'>
                AM
            </button>
            <Row className='order-list-table'>
                <Row className='order-list-1'>
                    <h1>Nhan Vien 1 </h1>
                    <p>8 Items</p>
                </Row>

                <h3 className='order-list-2'>Table No: 3</h3>

                <Row className='order-list-3'>
                    <p className='ready'><FaCheckDouble className='ready-icon' /> Ready</p>
                    <p className='ready-to-serve'><FaCircle className='ready-to-serve-icon' />Ready to serve</p>
                </Row>

            </Row>

        </Row>
    )
}

export default OrderList