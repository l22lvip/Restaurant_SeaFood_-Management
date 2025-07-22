import React, { useEffect, useState } from 'react'
import './css/Greeting.css'; // Assuming you have a CSS file for styling
import { Col, Row } from 'react-bootstrap';

const Greetings = () => {

    const [dateTime, setDateTime] = useState(new Date());

    useEffect(() => {

        // Update the date and time every second
        const timer = setInterval(() => {
            setDateTime(new Date());
        }, 1000);

        return () => {
            clearInterval(timer); // Clear the timer on component unmount
        };

    }, []);


    const formatDate = (date) => {
        const months = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
            "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];

        return `${months[date.getMonth()]} ${String(date.getDate()).padStart(2, '0')}, ${date.getFullYear()}`; // Format: Tháng 1 01, 2023
    };

    const formatTime = (date) => `${String(date.getHours()).padStart(2, '0')}
                                    :${String(date.getMinutes()).padStart(2, '0')}
                                    :${String(date.getSeconds()).padStart(2, '0')}`; // Format: 14:30:00

    return (
        <Row className='greetings'>
            <Col md={7} className='greetings-header' style={{marginBottom: '0'}}>
                <h1>Hãy tận hưởng những món ăn ngon nhất từ biển cả.</h1>
                {/* <p style={{marginBottom: '0'}}></p> */}
            </Col>
            <Col md={5} className='greetings-time' style={{margin: '0'}}>
                <h1>{formatTime(dateTime)}</h1>
                <p style={{marginBottom: '0'}}>{formatDate(dateTime)}</p>
            </Col>
        </Row>
    )
}

export default Greetings