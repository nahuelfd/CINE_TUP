/*import { Container } from "react-bootstrap";

const Forbidden = () => {
  return (
    <Container className="text-center mt-5">
      <h1>403</h1>
      <h3>Acceso denegado</h3>
      <p>No tienes permisos para ver esta página.</p>
    </Container>
  );
};

export default Forbidden;*/

import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ErrorNotFound = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate("/");
  };

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center text-center text-light position-relative"
      style={{
        height: "100vh",
        width: "100%",
        backgroundImage:
          "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQT4vhhnrkyd8vZHOFpF6QurfpOy1cJLQPeYA&s')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed", // 👈 mantiene la imagen fija
        overflow: "hidden",
      }}
    >
      {/* Overlay oscuro */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.6)", // oscurece la imagen
          zIndex: 0,
        }}
      ></div>

      {/* Contenido */}
      <div style={{ zIndex: 1 }}>
        <h1 className="fw-bold display-4 mb-3">403 Acceso denegado 😢</h1>
        <p className="fs-5 mb-4">
          Parece que no tienes permisos para el sitio que intentas visitar.
        </p>
        <Button variant="light" size="lg" onClick={goBack}>
          Regresar al inicio
        </Button>
      </div>
    </div>
  );
};

export default ErrorNotFound;
