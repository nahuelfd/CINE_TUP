import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Card, Col, Form, Row, Button } from "react-bootstrap";
import "./AddMovie.css"

const MovieForm = ({ movie, onMovieAdded, isEditing = false }) => {
  const [title, setTitle] = useState(movie?.title || "");
  const [director, setDirector] = useState(movie?.director || "");
  const [category, setCategory] = useState(movie?.category || "");
  const [summary, setSummary] = useState(movie?.summary || "");
  const [imageUrl, setImageUrl] = useState(movie?.imageUrl || "");
  const [bannerUrl, setBannerUrl] = useState(movie?.bannerUrl || "");
  const [duration, setDuration] = useState(movie?.duration || "");
  const [language, setLanguage] = useState(movie?.language || "");
  const [isAvailable, setIsAvailable] = useState(movie?.isAvailable || false);
  const [showtimes, setShowtimes] = useState(movie?.showtimes || []);
  const [occupied, setOccupied] = useState([]);
  const navigate = useNavigate();

  const toMinutes = (t) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  const rangesOverlap = (aStart, aEnd, bStart, bEnd) => aStart < bEnd && aEnd > bStart;


  useEffect(() => {
    const loadOccupiedTimes = async () => {
      try {
        const res = await fetch("http://localhost:3000/movies/occupied-times");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setOccupied(Array.isArray(data) ? data : []); // 🔹 asegura que siempre sea un array
      } catch (err) {
        console.error("Error cargando horarios ocupados:", err);
        setOccupied([]); // 🔹 evita que sea undefined
      }
    };
    loadOccupiedTimes();
  }, []);


  const handleSubmit = async (event) => {
    event.preventDefault();

    const newMovie = {
      title,
      director,
      category,
      summary,
      imageUrl,
      bannerUrl,
      duration: duration ? parseInt(duration, 10) : null,
      language,
      isAvailable,
      showtimes
    };

    try {
      const res = await fetch(
        isEditing
          ? `http://localhost:3000/movies/${movie.id}`
          : "http://localhost:3000/movies",
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

      if (!res.ok) {
        alert(data.message || "Error al guardar la película");
        return;
      }

      onMovieAdded();
      alert("Película agregada con éxito");

      if (!isEditing) {
        setTitle(""); setDirector(""); setCategory(""); setSummary("");
        setImageUrl(""); setBannerUrl(""); setDuration(""); setLanguage(""); setIsAvailable(false);
        setShowtimes([]);
      }

    } catch (err) {
      console.error("Error creando/actualizando película:", err);
      alert("Error inesperado al guardar la película");
    }

  };

  const generateTimeSlots = () => {
    const times = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        const hour = h.toString().padStart(2, "0");
        const minute = m.toString().padStart(2, "0");
        times.push(`${hour}:${minute}`);
      }
    }
    return times;
  };

  const allTimes = generateTimeSlots();

  const freeTimes = allTimes.filter(time => {
    if (!duration) return true;
    const start = toMinutes(time);
    const end = start + parseInt(duration, 10);

    if (!Array.isArray(occupied)) return true;

    return !occupied.some(o => rangesOverlap(start, end, o.start, o.end));
  });

  const handleAddShowtime = (time) => {
    if (!duration) {
      alert("Primero ingresa la duración de la película.");
      return;
    }

    const newStart = toMinutes(time);
    const newEnd = newStart + parseInt(duration);

    const hasOverlap = showtimes.some((t) => {
      const existingStart = toMinutes(t);
      const existingEnd = existingStart + parseInt(duration);
      return rangesOverlap(newStart, newEnd, existingStart, existingEnd);
    });

    if (hasOverlap) {
      alert("Este horario se solapa con otra función seleccionada.");
      return;
    }

    setShowtimes([...showtimes, time]);
  };

  const handleRemoveShowtime = (time) => {
    setShowtimes(showtimes.filter((t) => t !== time));
  };

  const handleGoBack = () => navigate("/");

  return (
    <Card className="movie-form-card mb-5 w-100">
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
            <Col md={12}>
              <Form.Group className="mb-3" controlId="showtimes">
                <Form.Label>Horarios de Función</Form.Label>
                <div className="d-flex flex-wrap align-items-center gap-2">
                  <Form.Select
                    onChange={(e) => handleAddShowtime(e.target.value)}
                    value=""
                  >
                    <option value="">Seleccionar horario...</option>
                    {allTimes.map((t) => {
                      const start = toMinutes(t);
                      const end = start + parseInt(duration || 0);
                      const isOccupied = occupied.some(o => rangesOverlap(start, end, o.start, o.end));

                      return (
                        <option key={t} value={t} disabled={isOccupied}>
                          {t} {isOccupied ? "⛔ (Ocupado)" : ""}
                        </option>
                      );
                    })}
                  </Form.Select>


                  <div className="d-flex flex-wrap gap-2 mt-2">
                    {showtimes.map((t) => (
                      <span key={t} className="badge bg-info text-dark">
                        {t}
                        <Button
                          variant="link"
                          size="sm"
                          className="ms-1 p-0"
                          onClick={() => handleRemoveShowtime(t)}
                        >
                          ❌
                        </Button>
                      </span>
                    ))}
                  </div>
                </div>
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
            <Col md={6}>
              <Form.Group className="mb-3" controlId="bannerUrl">
                <Form.Label>URL de Banner</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingresar URL del banner"
                  value={bannerUrl}
                  onChange={e => setBannerUrl(e.target.value)}
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
