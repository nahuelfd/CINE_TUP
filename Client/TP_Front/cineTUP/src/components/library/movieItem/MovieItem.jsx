import { useState } from "react"
import { Card, Badge, Button } from "react-bootstrap"


const MovieItem = ({
  title,
  category,
  duration,
  imageUrl,
  isAvailable
}) => {
  
  const handleClick = () => {
    console.log("Clicked!")
    setNewTitle("Actualizar Titulo")
  }
  const [newTitle, setNewTitle] = useState(title);


  return (
    
     <div className="movie-item-wrapper">
    <Card className="text-white border-0 shadow-sm movie-card">
      <Card.Img 
        src={imageUrl} 
        alt={newTitle} 
        className="movie-img"
      />
      <Card.ImgOverlay className="d-flex flex-column justify-content-end p-2">
        {isAvailable && (
          <Badge bg="danger" className="mb-2">{isAvailable ? 'Disponible' : 'No disponible'}</Badge>
        )}
        <Card.Title className="fw-bold" style={{ fontSize: '1rem' }}>{newTitle}</Card.Title>
        <Card.Text style={{ fontSize: '0.8rem' }}>{category} • {duration}</Card.Text>
      </Card.ImgOverlay>
    </Card>
    <Button 
      variant="primary" 
      className="mt-2"
      onClick={handleClick}>
        Cambiar titulo
    </Button>
    </div>
  )}

export default MovieItem