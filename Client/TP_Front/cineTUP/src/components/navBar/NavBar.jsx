import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link } from "react-router";


const NavBar = () => {
    
    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="px-2">
            <Container fluid>
                {/* Logo / Brand */}
                <Navbar.Brand href="/" className="fw-bold text-white fs-2">
                    CINETUP
                </Navbar.Brand>

                {/* Botón hamburguesa móvil */}
                <Navbar.Toggle aria-controls="basic-navbar-nav" />

                {/* Links + Login*/}
                <Navbar.Collapse id="basic-navbar-nav">
                    {/* Links centrados */}
                    <Nav className="mx-auto text-center">
                        <Nav.Link href="/peliculas" className="fw-bold text-white fs-5 mx-3">
                            PELÍCULAS
                        </Nav.Link>
                        <Nav.Link href="/estrenos" className="fw-bold text-white fs-5 mx-4">
                            PRÓXIMOS ESTRENOS
                        </Nav.Link>
                    </Nav>
                    {/* Botón Login a la derecha */}
                    <div className="d-flex">
                        <Button
                            as={Link} to="/login"
                            variant="outline-light"
                            className="fw-bold rounded-pill px-3"
                            
                        >
                            Iniciar Sesión
                        </Button>
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavBar;