import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

const EditMovieList = () => {
  const [movies, setMovies] = useState([]);

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
    <Container className="mt-4">
      <h2 className="text-center mb-4">Selecciona una película para editar</h2>
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {movies.map(movie => (
          <Col key={movie.id}>
            <Card className="h-100">
              <Card.Img variant="top" src={movie.imageUrl} />
              <Card.Body>
                <Card.Title>{movie.title}</Card.Title>
                <Card.Text>
                  {movie.category} · {movie.duration} min
                </Card.Text>
                <Link to={`/editar/${movie.id}`}>
                  <Button variant="warning" className="w-100">Editar</Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default EditMovieList;
