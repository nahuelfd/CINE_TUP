import { MOVIES } from "../../../data/data"
import MovieItem from "../movieItem/MovieItem"
import { Container, Row, Col } from "react-bootstrap"

const MovieList = () => {
  return (
    <Container className="mt-4">
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {MOVIES.map(movie => (
          <Col key={movie.id}>
            <MovieItem
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