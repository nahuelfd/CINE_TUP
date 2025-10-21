import { useState } from "react";
import MovieItem from "../movieItem/MovieItem"
import { Container, Row, Col, Form } from "react-bootstrap"

const MovieList = ({ movies }) => {
  const [searchTerm,setSearchTerm] = useState('')
  const [categoryFilter,setCategoryFilter] = useState('')
  const [durationFilter,setDurationFilter] = useState('')
  if (!Array.isArray(movies) || movies.length === 0) {
    return <p className="text-center mt-4">No hay películas disponibles.</p>;
  }
  const availableMovies = movies.filter(movie => movie.isAvailable)
  if (categoryFilter) {
    availableMovies = availableMovies.filter(movie => movie.category.toLowerCase() === categoryFilter.toLowerCase())
  }
  if (searchTerm) {
    availableMovies = availableMovies.filter(movie => movie.title.toLowerCase().includes(searchTerm.toLowerCase()))
  }
  if (!availableMovies || availableMovies.length === 0) {
    return <p className="text-center mt-4">No hay películas disponibles.</p>;
  }
  const uniqueCategories = [...new Set(movies.map(movie => movie.category))]
  return (
    <Container className="mt-4">
      <Form className="mb-4">
        <Row className="g-3 align-items-center">
          <Col xs={12} md={6}>
            <Form.Control
              type="text"
              placeholder="Buscar por título..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </Col>
          <Col xs={12} md={4}>
            <Form.Select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
            >
              <option value="">Todas las categorías</option>
              {uniqueCategories.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>
      </Form>
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

export default MovieList