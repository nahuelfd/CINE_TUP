import { useState } from "react";
import { useNavigate } from "react-router";
import { Card, Col, Form, Row, Button } from "react-bootstrap";
import { errorToast } from "../../shared/notifications/notification";

const MovieForm = ({ movie, onMovieAdded, isEditing = false }) => {
  const [title, setTitle] = useState(movie?.title || "");
  const [director, setDirector] = useState(movie?.director || "");
  const [category, setCategory] = useState(movie?.category || "");
  const [summary, setSummary] = useState(movie?.summary || "");
  const [imageUrl, setImageUrl] = useState(movie?.imageUrl || "");
  const [duration, setDuration] = useState(movie?.duration || "");
  const [language, setLanguage] = useState(movie?.language || "");
  const [isAvailable, setIsAvailable] = useState(movie?.isAvailable || false);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title || !director) {
      errorToast("El título y/o director son requeridos.");
      return;
    }

    const newMovie = {
      title,
      director,
      category,
      summary,
      imageUrl,
      duration: duration ? parseInt(duration, 10) : null,
      language,
      isAvailable
    };

    try {
      const res = await fetch(
        isEditing
          ? `http://localhost:3000/movie/${movie.id}`
          : "http://localhost:3000/movie",
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("cine-tup-token")}`,
          },
          body: JSON.stringify(newMovie),
        }
      );

      const data = await res.json();
      console.log(isEditing ? "Película editada:" : "Película creada:", data);
      onMovieAdded(); // refresca la lista
      if (!isEditing) {
        setTitle(""); setDirector(""); setCategory(""); setSummary("");
        setImageUrl(""); setDuration(""); setLanguage(""); setIsAvailable(false);
      }
    } catch (err) {
      console.error("Error creando/actualizando película:", err);
    }
  };

  const handleGoBack = () => navigate("/movies");

  return (
    <Card className="mb-5 w-100" bg="success">
      <Card.Body>
        <Form className="text-white" onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="title">
                <Form.Label>Título<span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingresar título"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="director">
                <Form.Label>Director<span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingresar director"
                  value={director}
                  onChange={e => setDirector(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="category">
                <Form.Label>Categoría</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingresar categoría"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="language">
                <Form.Label>Idioma</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingresar idioma"
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group className="mb-3" controlId="summary">
                <Form.Label>Resumen</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Ingresar resumen"
                  value={summary}
                  onChange={e => setSummary(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="duration">
                <Form.Label>Duración (min)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Ingresar duración"
                  value={duration}
                  onChange={e => setDuration(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="imageUrl">
                <Form.Label>URL de Imagen</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingresar URL de imagen"
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="justify-content-end">
            <Col md={3} className="d-flex flex-column justify-content-end align-items-end">
              <Form.Check
                type="switch"
                id="available"
                className="mb-3"
                label="¿Disponible?"
                checked={isAvailable}
                onChange={e => setIsAvailable(e.target.checked)}
              />
              <Button variant="secondary" onClick={handleGoBack} type="button" className="mb-3">
                Volver
              </Button>
              <Button type="submit">{isEditing ? "Editar Película" : "Agregar Película"}</Button>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default MovieForm;