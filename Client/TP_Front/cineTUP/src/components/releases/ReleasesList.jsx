import MovieItem from "../library/movieItem/MovieItem";
import { Container, Row, Col } from "react-bootstrap"

const ReleasesList = ({ movies }) => {
  if (!Array.isArray(movies) || movies.length === 0) {
    return <p className="text-center mt-4">No hay películas disponibles.</p>;
  }
  const availableMovies = movies.filter(movie => !movie.isAvailable)
  if (!availableMovies || availableMovies.length === 0) {
    return <p className="text-center mt-4">No hay películas disponibles.</p>;
  }
  return (
    <Container className="mt-4">
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {availableMovies.map(movie => (
          <Col key={movie.id}>
            <MovieItem
              id={movie.id}
              title={movie.title}
              category={movie.category}
              duration={`${movie.duration} min`}
              imageUrl={movie.imageUrl}
              isAvailable={movie.isAvailable}
            />
          </Col>
        ))}
      </Row>
    </Container>
  )
}

export default ReleasesList