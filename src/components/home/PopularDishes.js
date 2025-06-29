import React from 'react'
import { Row } from 'react-bootstrap'
import './css/PopularDishes.css'; // Assuming you have a CSS file for styling

const PopularDishes = () => {
    return (
        <Row className='popular-dishes'>
            <Row className='popular-dishes-content'>
                <Row className='popular-dishes-header'>
                    <h1>Recent Orders</h1>
                    <a href='/' className='view-all'>View All</a>
                </Row>
            </Row>
        </Row>
    )
}

export default PopularDishes