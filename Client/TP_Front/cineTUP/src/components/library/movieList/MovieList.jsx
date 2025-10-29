import { useState } from "react";
import MovieItem from "../movieItem/MovieItem";
import { Container, Row, Col, Form, Modal, Button } from "react-bootstrap";
import SimpleAlert from "../../SimpleAlert";

const MovieList = ({ movies, onMovieDeleted, isAdmin }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [durationOrder, setDurationOrder] = useState('');
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

  // Filtrar películas disponibles
  let availableMovies = movies.filter(movie => movie.isAvailable);

  // Filtro por título
  if (searchTerm) {
    availableMovies = availableMovies.filter(movie =>
      movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Ordenar por duración
  if (durationOrder) {
    if (durationOrder === "asc") {
      availableMovies = [...availableMovies].sort((a, b) => a.duration - b.duration);
    } else if (durationOrder === "desc") {
      availableMovies = [...availableMovies].sort((a, b) => b.duration - a.duration);
    }
  }

  // Filtrar por categoría
  if (categoryFilter) {
    availableMovies = availableMovies.filter(movie =>
      movie.category.toLowerCase() === categoryFilter.toLowerCase()
    );
  }

  // Obtener categorías únicas
  const uniqueCategories = [...new Set(movies.map(movie => movie.category))];

  // Función para eliminar película
  const handleDeleteMovie = async (id) => {
    try {
      const token = localStorage.getItem("cine-tup-token");
      const res = await fetch(`http://localhost:3000/movies/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
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
    <Container className="mt-4">
      {/* Filtros */}
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
                onDelete={isAdmin ? handleDeleteMovie : null}
              />
            </Col>
          ))}
        </Row>
      ) : (
        <p className="text-center mt-4">No hay películas disponibles con esos filtros.</p>
      )}
      <SimpleAlert
        show={alertShow}
        message={alertMessage}
        variant={alertVariant}
        onClose={() => setAlertShow(false)}
        duration={4000}
      />

    </Container>
  );
}

export default MovieList;
