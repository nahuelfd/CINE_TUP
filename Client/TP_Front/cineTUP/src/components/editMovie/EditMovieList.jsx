import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useTheme } from "../../context/ThemeContext";
import "./EditMovieList.css";

const EditMovieList = () => {
  const [movies, setMovies] = useState([]);
  const { theme } = useTheme(); 

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch("http://localhost:3000/movies");
        const data = await res.json();
        setMovies(data || []);
      } catch (err) {
        console.error("Error cargando películas:", err);
      }
    };

    fetchMovies();
  }, []);

  if (!movies.length) return <p className="text-center mt-4">No hay películas cargadas.</p>;

  return (
  <div className="movie-section-bg">
    <Container className="mt-4">
      <h2 className="text-center mb-4">Selecciona una película para editar</h2>
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {movies.map((movie) => (
          <Col key={movie.id}>
            <Card className="movie-card h-100">
              <Card.Img variant="top" src={movie.imageUrl} className="movie-img" />
              <Card.Body className="movie-card-body">
                <div>
                  <Card.Title className="movie-title">{movie.title}</Card.Title>
                  <Card.Text className="movie-info">
                    {movie.category} · {movie.duration} min
                  </Card.Text>
                </div>
                <Link to={`/editar/${movie.id}`}>
                  <Button variant="warning" className="w-100">Editar</Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  </div>
);
}

export default EditMovieList;
