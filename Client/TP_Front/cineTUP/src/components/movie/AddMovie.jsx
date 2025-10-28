import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Card, Col, Form, Row, Button } from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import "./AddMovie.css";

const MovieForm = ({ onMovieAdded, movie }) => {
  const navigate = useNavigate();

  const initShowtimes = () => {
    const raw = movie?.showtimes || [];
    return raw.map((s) =>
      typeof s === "string"
        ? { date: null, time: s }
        : { date: s?.date || null, time: s?.time }
    );
  };

  const [title, setTitle] = useState("");
  const [director, setDirector] = useState("");
  const [category, setCategory] = useState("");
  const [summary, setSummary] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [duration, setDuration] = useState("");
  const [language, setLanguage] = useState("");
  const [isAvailable, setIsAvailable] = useState(false);
  const [showtimes, setShowtimes] = useState(initShowtimes);
  const [occupied, setOccupied] = useState([]);

  const [selectedDate, setSelectedDate] = useState(() => {
    const firstWithDate = (movie?.showtimes || []).find(
      (s) => typeof s === "object" && s.date
    );
    if (firstWithDate) return new Date(firstWithDate.date);
    return new Date();
  });


  const toMinutes = (dateStr, timeStr) => {
    const date = new Date(`${dateStr}T${timeStr}:00`);
    return date.getTime() / 60000;
  };

  const rangesOverlap = (aStart, aEnd, bStart, bEnd) =>
    aStart < bEnd && aEnd > bStart;

  const formatDate = (d) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  useEffect(() => {
    const loadOccupiedTimes = async () => {
      try {
        const dateStr = formatDate(selectedDate);
        const res = await fetch(
          `http://localhost:3000/movies/occupied-times?date=${dateStr}`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setOccupied(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error cargando horarios ocupados:", err);
        setOccupied([]);
      }
    };
    loadOccupiedTimes();
  }, [selectedDate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validación extra
    if (!title || !director || !category || !language || !summary || !duration || !imageUrl || !bannerUrl || showtimes.length === 0) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    const newMovie = {
      title,
      director,
      category,
      summary,
      imageUrl,
      bannerUrl,
      duration: parseInt(duration, 10),
      language,
      isAvailable,
      showtimes: showtimes.map((s) => ({ date: s.date, time: s.time })),
    };

    try {
      const res = await fetch("http://localhost:3000/movies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("cine-tup-token")}`,
        },
        body: JSON.stringify(newMovie),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Error al guardar la película");
        return;
      }

      onMovieAdded();
      alert("Película agregada con éxito");

      // Limpiar formulario
      setTitle(""); setDirector(""); setCategory(""); setSummary("");
      setImageUrl(""); setBannerUrl(""); setDuration(""); setLanguage(""); setIsAvailable(false);
      setShowtimes([]);

    } catch (err) {
      console.error("Error creando película:", err);
      alert("Error inesperado al guardar la película");
    }
  };

  const generateTimeSlots = () => {
    const times = [];
    for (let h = 0; h < 24; h++) {
      const hour = h.toString().padStart(2, "0");
      times.push(`${hour}:00`);
    }
    return times;
  };

  const allTimes = generateTimeSlots();

  const handleAddShowtime = (time) => {
    if (!duration) {
      alert("Primero ingresa la duración de la película.");
      return;
    }

    const dateStr = formatDate(selectedDate);
    const newStart = toMinutes(dateStr, time);
    const newEnd = newStart + parseInt(duration, 10);

    // 🚫 Verificar solapamiento dentro de la misma película (todas las fechas)
    for (const s of showtimes) {
      const sStart = toMinutes(s.date, s.time);
      const sEnd = sStart + parseInt(duration, 10);
      if (rangesOverlap(newStart, newEnd, sStart, sEnd)) {
        alert(
          `El horario ${time} (${dateStr}) se solapa con ${s.time} (${s.date}).`
        );
        return;
      }
    }

    // 🚫 Verificar solapamiento con otras películas (ya ocupados)
    const isOccupied = occupied.some((o) => {
      const occStart = toMinutes(o.date, o.time);
      const occEnd = occStart + parseInt(duration, 10);
      return rangesOverlap(newStart, newEnd, occStart, occEnd);
    });

    if (isOccupied) {
      alert("Ese horario está ocupado por otra película.");
      return;
    }

    setShowtimes([...showtimes, { date: dateStr, time }]);
  };

  const handleRemoveShowtime = (time, date) => {
    setShowtimes(showtimes.filter((s) => !(s.time === time && s.date === date)));
  };

  const handleGoBack = () => navigate("/");

  return (
    <Card className="movie-form-card mb-5 w-100">
      <Card.Body>
        <Form className="text-white" onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="title">
                <Form.Label>
                  Título<span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingresar título"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="director">
                <Form.Label>
                  Director<span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingresar director"
                  value={director}
                  onChange={e => setDirector(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3" controlId="category">
                <Form.Label>Categoría<span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingresar categoría"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3" controlId="language">
                <Form.Label>Idioma<span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingresar idioma"
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group className="mb-3" controlId="summary">
                <Form.Label>Resumen<span className="text-danger">*</span></Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Ingresar resumen"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                />
              </Form.Group>
            </Col>

            <Row className="align-items-center mb-3">
              <Col md={6}>
                <Form.Group controlId="duration">
                  <Form.Label>Duración (min)</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Ingresar duración"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    style={{ maxWidth: "150px", marginLeft: "20px" }}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="showDate">
                  <Form.Label>Fecha de Función</Form.Label>
                  <div className="date-selector d-flex justify-content-start gap-3">
                    {[...Array(6)].map((_, i) => {
                      const date = new Date();
                      date.setDate(date.getDate() + i);
                      const label = date.toLocaleDateString("es-AR", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      });

                      return (
                        <div
                          key={i}
                          className={`date-block ${selectedDate.toDateString() ===
                            date.toDateString()
                            ? "selected"
                            : ""
                            }`}
                          onClick={() =>
                            setSelectedDate(
                              new Date(
                                date.getFullYear(),
                                date.getMonth(),
                                date.getDate()
                              )
                            )
                          }
                        >
                          {label}
                        </div>
                      );
                    })}
                  </div>
                </Form.Group>
              </Col>
            </Row>

            <Col md={12}>
              <Form.Group className="mb-3" controlId="showtimes">
                <Form.Label>Horarios de Función<span className="text-danger">*</span></Form.Label>
                <div className="d-flex flex-wrap align-items-center gap-2">
                  <Form.Select
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value) handleAddShowtime(value);
                      e.target.value = "";
                    }}
                    value=""

                  >
                    <option value="">Seleccionar horario...</option>
                    {allTimes.map((t) => {
                      const dateStr = formatDate(selectedDate);
                      const durationInt = parseInt(duration, 10) || 0;

                      const newStart = toMinutes(dateStr, t);
                      const newEnd = newStart + durationInt;

                      const conflicto = occupied.find((o) => {
                        const occStart = toMinutes(o.date, o.time);
                        const occEnd = occStart + parseInt(o.duration || durationInt, 10);
                        return rangesOverlap(newStart, newEnd, occStart, occEnd);
                      });

                      const ocupado = Boolean(conflicto);

                      return (
                        <option key={t} value={t} disabled={ocupado}>
                          {t} {ocupado ? `⛔ (Ocupado por ${conflicto.title})` : ""}
                        </option>
                      );
                    })}
                  </Form.Select>

                  <div className="d-flex flex-wrap gap-2 mt-2">
                    {showtimes.map((s) => (
                      <span
                        key={`${s.date}-${s.time}`}
                        className="badge bg-info text-dark"
                      >
                        {s.time} {s.date ? `(${s.date})` : "(sin fecha)"}
                        <Button
                          variant="link"
                          size="sm"
                          className="ms-1 p-0"
                          onClick={() =>
                            handleRemoveShowtime(s.time, s.date)
                          }
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
                <Form.Label>URL de Imagen<span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingresar URL de imagen"
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3" controlId="bannerUrl">
                <Form.Label>URL de Banner<span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingresar URL del banner"
                  value={bannerUrl}
                  onChange={e => setBannerUrl(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="justify-content-end">
            <Col
              md={3}
              className="d-flex flex-column justify-content-end align-items-end"
            >
              <Form.Check
                type="switch"
                id="available"
                className="mb-3"
                label="¿Disponible?"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
              />
              <Button
                variant="secondary"
                onClick={handleGoBack}
                type="button"
                className="mb-3"
              >
                Volver
              </Button>
              <Button type="submit">Agregar Película</Button>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default MovieForm;