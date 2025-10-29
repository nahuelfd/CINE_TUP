import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const NavBar = () => {
  const { theme, toggleTheme } = useTheme();
  const { token, role, onLogout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleEditFilmClick = () => {
    navigate("/editar");
  };

  const handleAdminClick = () => {
    navigate("/sysadminPanel"); 
  };

  const handleLogoutClick = () => {
    onLogout();
    navigate("/login");
  };

  

   return (
    <Navbar
      expand="lg"
      className="px-2 navbar-theme"
      bg={theme === "dark" ? "dark" : "light"}
      variant={theme === "dark" ? "dark" : "light"}
    >
      <Container fluid>
        <Navbar.Brand
          as={Link}
          to="/"
          className="fw-bold fs-2"
          style={{ color: "var(--nav-text)" }}
        >
          CINETUP
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
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

          <div className="d-flex gap-2 align-items-center">
            {!token ? (
              <Button
                as={Link}
                to="/login"
                variant={theme === "dark" ? "outline-light" : "outline-dark"}
                className="fw-bold rounded-pill px-3"
              >
                Iniciar Sesión
              </Button>
            ) : (
              <>
                {/* Renderizado según rol */}
                {(role === "user" || role === "admin" || role === "sysadmin") && (
                  <Button
                    onClick={handleProfileClick}
                    variant={theme === "dark" ? "outline-light" : "outline-dark"}
                    className="fw-bold rounded-pill px-3"
                  >
                    👤 Perfil
                  </Button>
                )}

                {(role === "admin" || role == "sysadmin") && (
                  <Button
                    onClick={handleEditFilmClick}
                    variant={theme === "dark" ? "outline-light" : "outline-dark"}
                    className="fw-bold rounded-pill px-3"
                  >
                    🎥 Editar Peliculas
                  </Button>
                )}

                {role === "sysadmin" && (
                  <Button
                    onClick={handleAdminClick}
                    variant={theme === "dark" ? "outline-light" : "outline-dark"}
                    className="fw-bold rounded-pill px-3"
                  >
                    ⚙️ Panel de Control
                  </Button>
                )}

                {/* Siempre mostrar cerrar sesión si hay token */}
                <Button
                  onClick={handleLogoutClick}
                  variant={theme === "dark" ? "outline-light" : "outline-dark"}
                  className="fw-bold rounded-pill px-3"
                >
                  Cerrar Sesión
                </Button>
              </>
            )}

            <Button
              onClick={toggleTheme}
              variant={theme === "dark" ? "outline-light" : "outline-dark"}
              className="fw-bold rounded-pill px-3"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;