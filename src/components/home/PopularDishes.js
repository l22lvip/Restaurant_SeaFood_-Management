import React, { useEffect, useState } from 'react';
import { Row } from 'react-bootstrap';
import './css/PopularDishes.css'; // Assuming you have a CSS file for styling
import axios from 'axios';


const PopularDishes = () => {
    const [popularDishes, setPopularDishes] = useState([]);
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        axios.get(`http://localhost:9999/menuItems`)
            .then(res => setPopularDishes(res.data))
            .then(err => console.log(err));

        axios.get(`http://localhost:9999/categories`)
            .then(res => setCategories(res.data))
            .then(err => console.log(err));
    },[])

    return (
        <Row className='popular-dishes'>
            <Row className='popular-dishes-content'>
  

                <Row className='popular-dishes-list' style={{ width: '700px', margin: 'auto' }}>
                    {
                        popularDishes.map((dish) => {
                            const category = categories.find(c => c.id == dish.categoryId);
                            return (
                                <Row className='popular-dishes-item'>
                                    <h1 className='popular-dishes-item-id'>{dish.id < 10 ? `0${dish.id}` : dish.id}</h1>
                                    <img src={dish.imageUrl} alt={dish?.name} className='' style={{ maxWidth: '250px',maxHeight: '250px', borderRadius: '10px' }} />
                                    <Row style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                                        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }} className='popular-dishes-item-name'>{dish?.name}</h1>
                                        <h1 style={{ fontSize: '1rem', color: 'gray', marginTop: '0' }} className='popular-dishes-item-category'>{category?.name}</h1>
                                        <h1 className='popular-dishes-item-price' style={{ color: 'gold', fontSize: '1.5rem', fontWeight: 'bold' }}>{dish.price} đ</h1>
                                    </Row>
                                </Row>
                            )
                        })
                    }
                </Row>
                <div style={{ marginBottom: '1000px' }}></div>
            </Row>
        </Row>
    )
}

export default PopularDishes