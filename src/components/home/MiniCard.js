import React from 'react'
import './css/MiniCard.css'; // Assuming you have a CSS file for styling
import { Col, Row } from 'react-bootstrap';

const MiniCard = ({title, icon, number, footerNum}) => {

  return (
    <Row className='mini-card-section '>
        <Col className='mini-card-title' >
            <h1 >{title}</h1>
            <button className={`${title === "Total Earnings" ? "button-total-earnings" : "button-other-category"}`}>{icon}</button>
        </Col>
        <Col className='mini-card-number'>
            <h1 className='mini-card-number'>{number}</h1>
            <h1 className='mini-card-footer'><span>{footerNum}% </span> than yesterday</h1>
        </Col>
    </Row>
  )
}

export default MiniCard