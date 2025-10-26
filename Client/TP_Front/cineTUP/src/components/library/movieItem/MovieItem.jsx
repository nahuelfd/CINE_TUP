import { Card, Badge } from "react-bootstrap";
import { Link } from "react-router";

const MovieItem = ({ id, title, category, duration, imageUrl, isAvailable }) => {
  return (
    <Link to={`/peliculas/${id}`} style={{ textDecoration: "none", color: "inherit" }}>
      <Card className="movie-card h-100 shadow-sm">
        <Card.Img variant="top" src={imageUrl} className="movie-img" />
        <Card.Body>
          <Card.Title className="movie-title">{title}</Card.Title>
          <Card.Text className="movie-info">
            {category} · {duration} min
          </Card.Text>
          {isAvailable ? (
            <Badge bg="success">Disponible</Badge>
          ) : (
            <Badge bg="secondary">No disponible</Badge>
          )}
        </Card.Body>
      </Card>
    </Link>
  );
};

export default MovieItem;