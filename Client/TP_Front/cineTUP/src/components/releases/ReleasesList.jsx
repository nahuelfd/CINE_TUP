import MovieItem from "../library/movieItem/MovieItem";
import { Container, Row, Col } from "react-bootstrap";

const ReleasesList = ({ movies, onMovieDeleted, isAdmin }) => {
  if (!Array.isArray(movies) || movies.length === 0) {
    return <p className="text-center mt-4">No hay películas disponibles.</p>;
  }

  // Filtrar solo estrenos (no disponibles aún)
  let upcomingMovies = movies.filter(movie => !movie.isAvailable);
  if (upcomingMovies.length === 0) {
    return <p className="text-center mt-4">No hay películas disponibles.</p>;
  }

  // Función para eliminar película
  const handleDeleteMovie = async (id) => {
    try {
      const token = localStorage.getItem("cine-tup-token");
      const res = await fetch(`http://localhost:3000/movies/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al eliminar la película");
      onMovieDeleted();
    } catch (err) {
      console.error(err);
      alert("No se pudo eliminar la película");
    }
  };

  return (
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
  );
};

export default ReleasesList;
