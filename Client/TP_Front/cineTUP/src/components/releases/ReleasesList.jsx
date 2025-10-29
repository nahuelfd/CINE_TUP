import MovieItem from "../library/movieItem/MovieItem";
import { Container, Row, Col } from "react-bootstrap";
import { useState } from "react";
import SimpleAlert from "../SimpleAlert";

const ReleasesList = ({ movies, onMovieDeleted, isAdmin }) => {
  const [alertShow, setAlertShow] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("info");

  const showAlert = (message, variant = "info", duration = 4000) => {
    setAlertMessage(message);
    setAlertVariant(variant);
    setAlertShow(true);
    setTimeout(() => setAlertShow(false), duration);
  };

  if (!Array.isArray(movies) || movies.length === 0) {
    return <p className="text-center mt-4">No hay películas disponibles.</p>;
  }

  const upcomingMovies = movies.filter(movie => !movie.isAvailable);

  if (upcomingMovies.length === 0) {
    return <p className="text-center mt-4">No hay estrenos disponibles.</p>;
  }

  const handleDeleteMovie = async (id) => {
    try {
      const token = localStorage.getItem("cine-tup-token");
      const res = await fetch(`${import.meta.env.VITE_APP_API_URL}/movies/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al eliminar la película");
      onMovieDeleted();
      showAlert("Película eliminada correctamente", "success");
    } catch (err) {
      console.error(err);
      showAlert("No se pudo eliminar la película", "danger");
    }
  };

  return (
    <>
      <Container className="mt-4">
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {upcomingMovies.map(movie => (
            <Col key={movie.id}>
              <MovieItem
                id={movie.id}
                title={movie.title}
                category={movie.category}
                duration={`${movie.duration} min`}
                imageUrl={movie.imageUrl}
                isAvailable={movie.isAvailable}
                onDelete={isAdmin ? handleDeleteMovie : null}
              />
            </Col>
          ))}
        </Row>
      </Container>

      <SimpleAlert
        show={alertShow}
        message={alertMessage}
        variant={alertVariant}
        onClose={() => setAlertShow(false)}
        duration={4000}
      />
    </>
  );
};

export default ReleasesList;
