import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { RiMenu3Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const ClientHeader = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user')) || {};
    return (
        <Navbar expand="lg" className="fixed-top bg-white border-bottom shadow-sm">
            <Container>
                <Navbar.Brand href="home" className="fw-bold">
                    Harbor Fresh<span className="text-danger">.</span>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav">
                    <RiMenu3Line className="fs-2" />
                </Navbar.Toggle>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto gap-3 align-items-center">
                        {['Home', 'Menu', 'Chefs', 'Contact'].map((link) => (
                            <Nav.Link key={link} href={`/${link.toLowerCase()}`}>
                                {link}
                            </Nav.Link>
                        ))}
                        {user?.role && (
                           <Button variant="outline-danger" onClick={() => navigate('/staff')} className="rounded-5">
                                Quay lại trang làm việc
                            </Button>
                        )}
                        {!user?.role  && (
                            <Button variant="outline-danger" onClick={() => navigate('/login')} className="rounded-5">
                                Đăng nhập
                            </Button>
                        )}

                        <Button variant="danger" onClick={() => navigate('/book')} className="rounded-5 ms-2">
                            Đặt bàn
                        </Button>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default ClientHeader;