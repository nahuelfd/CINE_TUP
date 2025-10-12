import MovieItem from "../movieItem/MovieItem"
import { Container, Row, Col } from "react-bootstrap"

const MovieList = ({ movies }) => {
  if (!movies || movies.length === 0) {
    return <p className="text-center mt-4">No hay películas disponibles.</p>;
  }
  return (
    <Container className="mt-4">
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {movies.map(movie => (
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

export default MovieList