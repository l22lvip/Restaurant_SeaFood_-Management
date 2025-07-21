import React from "react";
import "../css/Home.css"; // Assuming you have a CSS file for styling
import Greetings from "../components/home/Greetings";
import { Col, Container, Row } from "react-bootstrap";
import MiniCard from "../components/home/MiniCard";
import { BsCashCoin } from "react-icons/bs";
import { GrInProgress } from "react-icons/gr";
import RecentOrders from "../components/home/RecentOrders";
import PopularDishes from "../components/home/PopularDishes";

const Home = () => {
  return (
    <Container className="home-container">
      <Col className="home-left">
        <Row className="greeting-section">
          {/* Greetings Section */}
          <Greetings />
        </Row>

        {/* Mini Card */}
        {/* <Row className="mini-card">
            <MiniCard className="mini-card-total" title="Total Earnings" icon={<BsCashCoin/>} number={1200} footerNum={1.6}/>
            <MiniCard title="In Progress" icon={<GrInProgress/>} number={16} footerNum={3.6}/>
        </Row> */}

        {/* Recent Orders Section */}
        <Row className="recent-orders">
          <RecentOrders/>
        </Row>
        
      </Col>

      <Col className="home-right">
        <PopularDishes /> 
      </Col>
    </Container>
  );
}

export default Home;

