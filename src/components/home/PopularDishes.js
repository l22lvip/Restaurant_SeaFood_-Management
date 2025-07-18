import React, { useEffect, useState } from 'react';   
import { Row } from 'react-bootstrap';
import './css/PopularDishes.css'; // Assuming you have a CSS file for styling
import axios from 'axios';


const PopularDishes = () => {
    const [popularDishes, setPopularDishes ] = useState([]);

    useEffect(()=>{
        axios.get(`http://localhost:9999/menuItems`)
            .then(res => setPopularDishes(res.data))
            .then(err => console.log(err));
    })

    return (
        <Row className='popular-dishes'>
            <Row className='popular-dishes-content'>
                <Row className='popular-dishes-header'>
                    <h1>Popular Dishes</h1>
                    <a href='/' className='view-all'>View All</a>
                </Row>

                <Row className='popular-dishes-list'>
                    {
                        popularDishes.map((dish)=>{
                            return (
                                <Row className='popular-dishes-item'>
                                    <h1 className='popular-dishes-item-id'>{dish.id < 10 ? `0${dish.id}` : dish.id}</h1>
                                    <img src={dish.imageUrl} alt={dish.name} className='popular-dishes-item-image' />
                                    <Row>
                                        <h1 className='popular-dishes-item-name'>{dish.name}</h1>
                                    </Row>
                                </Row>
                            )
                        })
                    }
                </Row>
            </Row>
        </Row>
    )
}

export default PopularDishes