import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { RiMenu3Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const ClientHeader = () => {
    const navigate = useNavigate();
    return (
        <Navbar expand="lg" className="fixed-top bg-white">
            <Container>
                <Navbar.Brand href="#home" className="fw-bold">
                    Yummy<span className="text-danger">.</span>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav">
                    <RiMenu3Line className="fs-2" />
                </Navbar.Toggle>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto gap-3 align-items-center">
                        {['Home', 'Menu', 'Chefs', 'Contact'].map((link) => (
                            <Nav.Link  key={link} href={`/${link.toLowerCase()}`}>
                                {link}
                            </Nav.Link>
                        ))}
                        <Button variant="outline-danger" onClick={() => navigate('/login')} className="rounded-5">
                            Login
                        </Button>
                        <Button variant="danger" onClick={() => navigate('/book')} className="rounded-5 ms-2">
                            Book a Table
                        </Button>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default ClientHeader;