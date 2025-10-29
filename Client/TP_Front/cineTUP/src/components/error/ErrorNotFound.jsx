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
          "url('https://www.miradorprovincial.com/wp-content/uploads/2025/04/Copetti-se-saco-la-mufa-y-empezo-a-sumar-goles-para-Central.jpg')",
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
        <h1 className="fw-bold display-4 mb-3">Página no encontrada 😢</h1>
        <p className="fs-5 mb-4">
          Parece que el sitio que intentas visitar no existe o fue movido.
        </p>
        <Button variant="light" size="lg" onClick={goBack}>
          Regresar al inicio
        </Button>
      </div>
    </div>
  );
};

export default ErrorNotFound;
