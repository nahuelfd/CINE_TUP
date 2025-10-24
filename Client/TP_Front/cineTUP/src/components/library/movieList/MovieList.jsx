import { useState } from "react";
import MovieItem from "../movieItem/MovieItem"
import { Container, Row, Col, Form } from "react-bootstrap"

const MovieList = ({ movies }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [durationOrder, setDurationOrder] = useState('')
  if (!Array.isArray(movies) || movies.length === 0) {
    return <p className="text-center mt-4">No hay películas disponibles.</p>;
  }
  let availableMovies = movies.filter(movie => movie.isAvailable)
  if (categoryFilter) {
    availableMovies = availableMovies.filter(movie => movie.category.toLowerCase() === categoryFilter.toLowerCase())
  }
 if (durationOrder) {
  if (durationOrder === "asc") {
    availableMovies = [...availableMovies].sort((a, b) => a.duration - b.duration);
  } else if (durationOrder === "desc") {
    availableMovies = [...availableMovies].sort((a, b) => b.duration - a.duration);
  }
}
  if (categoryFilter) {
    availableMovies = availableMovies.filter(movie => movie.category.toLowerCase() === categoryFilter.toLowerCase())
  }
  const uniqueCategories = [...new Set(movies.map(movie => movie.category))]
  return (
    <Container className="mt-4">
      <Form className="mb-4">
  <Row className="align-items-center g-2">
    {/* Categoría */}
    <Col xs="12" md="4">
      <Form.Select
        value={categoryFilter}
        onChange={e => setCategoryFilter(e.target.value)}
      >
        <option value="">Todas las categorías</option>
        {uniqueCategories.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </Form.Select>
    </Col>

    {/* Búsqueda */}
    <Col xs="12" md="5">
      <Form.Control
        type="text"
        placeholder="Buscar por título..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
    </Col>

    {/* Ordenar duración */}
    <Col xs="12" md="3">
      <Form.Select
        value={durationOrder}
        onChange={e => setDurationOrder(e.target.value)}
      >
        <option value="">Ordenar duración</option>
        <option value="asc">Menor a mayor</option>
        <option value="desc">Mayor a menor</option>
      </Form.Select>
    </Col>
  </Row>
</Form>
      {availableMovies.length > 0 ? (
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
      ) : (<p className="text-center mt-4">No hay películas disponibles con esos filtros.</p>

      )}
    </Container>
  )
}

export default MovieList