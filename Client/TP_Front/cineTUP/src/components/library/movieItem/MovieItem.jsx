import { useState } from "react"
import { Card, Badge, Button } from "react-bootstrap"


const MovieItem = ({
  title,
  category,
  duration,
  imageUrl,
  isAvailable
}) => {
  return (
    
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
  );
};

export default MovieItem