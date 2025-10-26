import { Card, Badge, Button } from "react-bootstrap";
import { Link } from "react-router";

const MovieItem = ({ id, title, category, duration, imageUrl, isAvailable, onDelete }) => {
  const handleDelete = () => {
    if (window.confirm(`¿Deseas eliminar la película "${title}"?`)){
      onDelete(id)
    }
  }
  return (
    <div style={{ position: "relative" }}>
      <Button
      variant= "danger"
      size="sm"
      style={{ position: "absolute", top: 10, right: 10, zIndex: 10}}
      onClick={handleDelete}>
        x
      </Button>
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
    </div>
  );
};

export default MovieItem;