import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

const NavBar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Navbar
      expand="lg"
      className="px-2 navbar-theme"
      bg={theme === "dark" ? "dark" : "light"}
      variant={theme === "dark" ? "dark" : "light"}
    >
      <Container fluid>
        {/* Logo */}
        <Navbar.Brand
          as={Link}
          to="/"
          className="fw-bold fs-2"
          style={{ color: "var(--nav-text)" }}
        >
          CINETUP
        </Navbar.Brand>

        {/* Botón hamburguesa móvil */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        {/* Links */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto text-center">
            <Nav.Link
              as={Link}
              to="/peliculas"
              className="fw-bold fs-5 mx-3"
              style={{ color: "var(--nav-text)" }}
            >
              PELÍCULAS
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/estrenos"
              className="fw-bold fs-5 mx-4"
              style={{ color: "var(--nav-text)" }}
            >
              PRÓXIMOS ESTRENOS
            </Nav.Link>
          </Nav>

          {/* Botones a la derecha */}
          <div className="d-flex gap-2 align-items-center">
            <Button
              as={Link}
              to="/login"
              variant={theme === "dark" ? "outline-light" : "outline-dark"}
              className="fw-bold rounded-pill px-3"
            >
              Iniciar Sesión
            </Button>

            {/* Botón de toggle de tema */}
            <Button
              onClick={toggleTheme}
              variant={theme === "dark" ? "outline-light" : "outline-dark"}
              className="fw-bold rounded-pill px-3"
            >
              {theme === "dark" ? "☀️ Claro" : "🌙 Oscuro"}
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
