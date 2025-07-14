import { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Navbar, Nav, Form } from 'react-bootstrap';
import { RiMenu3Line, RiPlayCircleLine } from 'react-icons/ri';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaMapMarkerAlt, FaEnvelope, FaPhone, FaShare } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './home.css';
import { chef1, chef2, chef3, event1, event2, event3, menuItem1, menuItem2, menuItem3, menuItem4, menuItem5, menuItem6, reservation } from '../../assets';
import ClientHeader from '../../components/shared/ClientHeader';


const contactItems = [
  { id: 1, icon: <FaMapMarkerAlt />, title: 'Our Address', content: 'Hà Nội, Đại học FPT' },
  { id: 2, icon: <FaEnvelope />, title: 'Email Us', content: 'seafoodRestaurant@example.com' },
  { id: 3, icon: <FaPhone />, title: 'Call Us', content: '0981234567' },
  { id: 4, icon: <FaShare />, title: 'Opening Hours', content: '10AM - 10:30PM' },
];


const HomePage = () => {

  const menuItems = [
    { id: 1, img: menuItem1, price: '$6.27' },
    { id: 2, img: menuItem2, price: '$9.95' },
    { id: 3, img: menuItem3, price: '$10.52' },
    { id: 4, img: menuItem4, price: '$5.95' },
    { id: 5, img: menuItem5, price: '$12.24' },
    { id: 6, img: menuItem6, price: '$5.34' }
  ];


  const chefs = [
    {
      id: 1,
      img: chef1,
      name: 'Walter White',
      position: 'Master Chef',
      bio: 'Velit aut quia fugit et et. Dolorum ea voluptate vel tempore tenetur ipsa quae aut.'
    },
    {
      id: 2,
      img: chef2,
      name: 'Sarah Jhonson',
      position: 'Patissier',
      bio: 'Velit aut quia fugit et et. Dolorum ea voluptate vel tempore tenetur ipsa quae aut.'
    },
    {
      id: 3,
      img: chef3,
      name: 'William Anderson',
      position: 'Cook',
      bio: 'Velit aut quia fugit et et. Dolorum ea voluptate vel tempore tenetur ipsa quae aut.'
    },
  ];

  const [activeCategory, setActiveCategory] = useState(null)

  return (
    <div className="home-page">


      {/* HomePage Section */}
      <section id="home" className="bg-light pt-5">
        <Container>
          <Row className="flex-lg-row-reverse align-items-center">
            <Col lg={6} className="text-center p-5" data-aos="fade-up">
              <img src={menuItem1} alt="food" className="img-fluid rotating-image" />
            </Col>
            <Col lg={6} data-aos="fade-up">
              <h1 className="display-5 fw-bold mb-4">
                Enjoy Your Delicious <br />
                Sea Food
              </h1>
              <p className="lead">
                Variable and fresh dishes serve by over 20 years of experience chefs.
                The customers’ satisfaction is our happiness.

              </p>
              <div className="d-flex gap-3 mt-4">
                <Button variant="danger" className="rounded-5">
                  Book a Table
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Event Slider */}


      {/* Menu Section */}
      <section id="menu" className="py-5 bg-light" data-aos="fade-up">
        <Container>
          <div className="text-center mb-5">
            <p className="text-uppercase text-secondary">Our Menu</p>
            <h2 className="mb-4">Check Our Menu</h2>
          </div>
          <div className="d-flex justify-content-center gap-3 mb-4 flex-wrap">
            {['Fish', 'Shrimp', 'Crab', 'Lobster'].map((category) => (
              <Button
                key={category}
                variant="outline-danger"
                className="rounded-pill"
                active={activeCategory === category}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
          <Row className="g-4">
            {menuItems.map((item) => (
              <Col lg={4} md={6} key={item.id} data-aos="zoom-in">
                <div className="menu-item card border-0 h-100">
                  <img src={item.img} className="card-img-top" alt={item.title} />
                  <div className="card-body text-center">
                    <h5 className="card-title">Magnam Tiste</h5>
                    <p className="card-text text-muted">Lorem, deren, trataro, filede, nerada</p>
                    <div className="text-danger fw-bold fs-4">{item.price}</div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Chefs Section */}
      <section id="chefs" className="py-5" data-aos="fade-up">
        <Container>
          <div className="text-center mb-5">
            <p className="text-uppercase text-secondary">Chefs</p>
            <h2 className="mb-4">Our Professional Chefs</h2>
          </div>
          <Row className="g-4">
            {chefs.map((chef) => (
              <Col lg={4} md={6} key={chef.id}>
                <div className="card border-0 shadow-lg h-100">
                  <img src={chef.img} className="card-img-top" alt={chef.name} />
                  <div className="card-body text-center">
                    <h5 className="card-title">{chef.name}</h5>
                    <p className="text-muted">{chef.position}</p>
                    <p className="card-text">{chef.bio}</p>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Book a Table Section */}
      <section id="book" className="py-5 bg-light" data-aos="fade-up">
        <Container>
          <div className="text-center mb-5">
            <p className="text-uppercase text-secondary">Reservation</p>
            <h2 className="mb-4">Book Your Table</h2>
          </div>
          <Row className="g-4 align-items-center">
            <Col lg={5}>
              <img src={reservation} alt="Reservation" className="img-fluid rounded" />
            </Col>
            <Col lg={7}>
              <Form className="row g-3">
                <Col md={6}>
                  <Form.Control placeholder="Your Name" />
                </Col>
                <Col md={6}>
                  <Form.Control type="tel" placeholder="Phone Number" />
                </Col>
                <Col md={12}>
                  <Form.Control type="email" placeholder="Email Address" />
                </Col>
                <Col md={6}>
                  <Form.Control type="date" />
                </Col>
                <Col md={6}>
                  <Form.Control type="time" />
                </Col>
                <Col md={6}>
                  <Form.Control placeholder="City" />
                </Col>
                <Col md={6}>
                  <Form.Control placeholder="State" />
                </Col>
                <Col md={12}>
                  <Form.Control as="textarea" rows={4} placeholder="Message" />
                </Col>
                <Col md={12} className="text-center">
                  <Button variant="danger" size="lg" className="rounded-pill px-5">
                    Book Table
                  </Button>
                </Col>
              </Form>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-5" data-aos="fade-up">
        <Container>
          <div className="text-center mb-5">
            <p className="text-uppercase text-secondary">Contact</p>
            <h2 className="mb-4">
              Need Help? <span className="text-danger">Contact Us</span>
            </h2>
          </div>

          <iframe title='map'
            src="https://www.google.com/maps/embed?pb=!1m12!1m8!1m3!1d3409.267232491751!2d105.5251515!3d21.0130276!3m2!1i1024!2i768!4f13.1!2m1!1sdh%20fpt!5e1!3m2!1svi!2s!4v1752520937392!5m2!1svi!2s"
            height="500" className='w-100' style={{ border: 0 }} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>

          <Row className="g-4 mt-4">
            {contactItems.map((item) => (
              <Col md={6} lg={3} key={item.id}>
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body text-center">
                    <div className="icon-wrapper mb-3">
                      {item.icon}
                    </div>
                    <h5 className="card-title">{item.title}</h5>
                    <p className="card-text text-muted">{item.content}</p>
                  </div>
                </div>
              </Col>
            ))}
          </Row>

          {/* Contact Form */}
          <div className="mt-5 p-4 bg-light rounded">
            <Form className="row g-3">
              {/* ... Form fields tương tự section Book */}
            </Form>
          </div>
        </Container>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-5">
        <Container>
          <Row className="g-4">
            {/* Các cột footer */}
            <Col md={3}>
              <div className="d-flex align-items-start gap-2">
                <FaMapMarkerAlt className="mt-1" />
                <div>
                  <h6>Address</h6>
                  <p className="text-white">Hà Nội<br />Đại học FPT</p>
                </div>
              </div>
            </Col>
          </Row>
          <hr className="my-4" />
          <div className="text-center">
            <p className="mb-1">© Copyright Yummy. All Rights Reserved</p>
            <p className="text-muted">Designed by BootstrapMade</p>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default HomePage;
