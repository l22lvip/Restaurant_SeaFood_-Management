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
                    <h1>Món ăn</h1>
                    {/* <a href='/' className='view-all'>View All</a> */}
                </Row>

                <Row className='popular-dishes-list' style={{}}>
                    {
                        popularDishes.map((dish)=>{
                            return (
                                <Row className='popular-dishes-item'>
                                    <h1 className='popular-dishes-item-id'>{dish.id < 10 ? `0${dish.id}` : dish.id}</h1>
                                    <img src={dish.imageUrl} alt={dish.name} className='popular-dishes-item-image' style={{width: '100px', height: '100px', borderRadius: '10px'}}/>
                                    <Row style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                                        <h1 className='popular-dishes-item-name'>{dish.name}</h1>
                                        <h1 className='popular-dishes-item-price' style={{color: 'gold'}}>{dish.price} đ</h1>
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