import { useState } from "react";
import { Card, Badge, Button, Modal } from "react-bootstrap";
import { Link } from "react-router";

const MovieItem = ({ id, title, category, duration, imageUrl, isAvailable, onDelete }) => {
  const [modalShow, setModalShow] = useState(false);

  const handleDelete = () => {
    setModalShow(true); // mostrar modal en vez de window.confirm
  };

  const confirmDelete = () => {
    onDelete(id);
    setModalShow(false);
  };
  /*const handleDelete = () => {
    if (window.confirm(`¿Deseas eliminar la película "${title}"?`)) {
      onDelete(id);
    }
  }*/

  return (
    <div style={{ position: "relative" }}>
      {onDelete && (
        <Button
          variant="danger"
          size="sm"
          style={{ position: "absolute", top: 10, right: 10, zIndex: 10}}
          onClick={handleDelete}
        >
          x
        </Button>
      )}

      <Link to={`/peliculas/${id}`} style={{ textDecoration: "none", color: "inherit" }}>
        <Card className="movie-card h-100 shadow-sm">
          <Card.Img variant="top" src={imageUrl} className="movie-img" />
          <Card.Body>
            <Card.Title className="movie-title">{title}</Card.Title>
            <Card.Text className="movie-info">
              {category} · {duration}
            </Card.Text>
            {isAvailable ? (
              <Badge bg="success">Disponible</Badge>
            ) : (
              <Badge bg="secondary">No disponible</Badge>
            )}
          </Card.Body>
        </Card>
      </Link>
      <Modal show={modalShow} onHide={() => setModalShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Deseas eliminar la película "{title}"?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalShow(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    
    </div>
  );
};

export default MovieItem;
