import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Card, Col, Form, Row, Button } from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import "./AddMovie.css";
import SimpleAlert from "../SimpleAlert";

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
  const [showtimes, setShowtimes] = useState(initShowtimes);
  const [occupied, setOccupied] = useState([]);
  const [movies, setMovies] = useState([]);
  const [alertShow, setAlertShow] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("info");

  const showAlert = (message, variant = "info", duration = 4000) => {
    setAlertMessage(message);
    setAlertVariant(variant);
    setAlertShow(true);
    setTimeout(() => setAlertShow(false), duration);
  };


  const [selectedDate, setSelectedDate] = useState(() => {
    const firstWithDate = (movie?.showtimes || []).find(
      (s) => typeof s === "object" && s.date
    );
    return firstWithDate ? new Date(firstWithDate.date) : null;
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
      if (!selectedDate) {
        setOccupied([]);
        return;
      }
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


  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !title ||
      !director ||
      !category ||
      !language ||
      !summary ||
      !duration ||
      !imageUrl ||
      !bannerUrl
    ) {
      showAlert("Todos los campos son obligatorios.", "warning");
      return;
    }

    const exist = movies.some(
      (m) => m.title.toLowerCase().trim() === title.toLowerCase().trim()
    );
    if (exist) {
      showAlert("Ya existe una película cargada con este título.", "warning");
      return;
    }

    const tieneFecha = showtimes.some((s) => s.date);
    const tieneHorario = showtimes.some((s) => s.time);

    if (tieneFecha && !tieneHorario) {
      showAlert(
        "Seleccionaste una fecha pero no un horario. Debes completar ambos para cargarla en Cartelera.",
        "warning"
      );
      return;
    }

    if (!tieneFecha && tieneHorario) {
      showAlert(
        "Seleccionaste un horario pero no una fecha. Debes completar ambos para cargarla en Cartelera.",
        "warning"
      );
      return;
    }

    let isAvailable = false;

    if (tieneFecha && tieneHorario) {
      isAvailable = true;
    } else if (!tieneFecha && !tieneHorario) {
      showAlert(
        "No seleccionaste fecha ni horario. La película se cargará como 'Próximo Estreno'.",
        "info",
        5000
      );
      isAvailable = false;
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
          Authorization: `Bearer ${localStorage.getItem("cine-tup-token")}`,
        },
        body: JSON.stringify(newMovie),
      });

      const data = await res.json();

      if (!res.ok) {
        showAlert(data.message || "Error al guardar la película", "danger");
        return;
      }

      onMovieAdded();
      showAlert("Película agregada con éxito", "success");

      setTitle("");
      setDirector("");
      setCategory("");
      setSummary("");
      setImageUrl("");
      setBannerUrl("");
      setDuration("");
      setLanguage("");
      setShowtimes([]);
      setSelectedDate(null);
    } catch (err) {
      console.error("Error creando película:", err);
      showAlert("Error inesperado al guardar la película", "danger");
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
    if (!selectedDate) {
      showAlert("Primero selecciona una fecha para agregar un horario.", "warning");
      return;
    }

    if (!duration) {
      showAlert("Primero ingresa la duración de la película.", "warning");
      return;
    }

    const dateStr = formatDate(selectedDate);
    const newStart = toMinutes(dateStr, time);
    const newEnd = newStart + parseInt(duration, 10);

    for (const s of showtimes) {
      const sStart = toMinutes(s.date, s.time);
      const sEnd = sStart + parseInt(duration, 10);
      if (rangesOverlap(newStart, newEnd, sStart, sEnd)) {
        showAlert(
          `El horario ${time} (${dateStr}) se solapa con ${s.time} (${s.date}).`, "warning"
        );
        return;
      }
    }

    const isOccupied = occupied.some((o) => {
      const occStart = toMinutes(o.date, o.time);
      const occEnd = occStart + parseInt(duration, 10);
      return rangesOverlap(newStart, newEnd, occStart, occEnd);
    });

    if (isOccupied) {
      showAlert("Ese horario está ocupado por otra película.", "warning");
      return;
    }

    setShowtimes([...showtimes, { date: dateStr, time }]);
  };

  const handleRemoveShowtime = (time, date) => {
    setShowtimes(showtimes.filter((s) => !(s.time === time && s.date === date)));
  };

  const handleGoBack = () => navigate("/");

  const inputStyle = {
    backgroundColor: "#222",
    color: "white",
    border: "1px solid #555",
  };

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
                  onChange={(e) => setTitle(e.target.value)}
                  style={inputStyle}
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
                  onChange={(e) => setDirector(e.target.value)}
                  style={inputStyle}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3" controlId="category">
                <Form.Label>
                  Categoría<span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingresar categoría"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={inputStyle}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3" controlId="language">
                <Form.Label>
                  Idioma<span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingresar idioma"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  style={inputStyle}
                />
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group className="mb-3" controlId="summary">
                <Form.Label>
                  Resumen<span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Ingresar resumen"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  style={inputStyle}
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
                    style={{ ...inputStyle, maxWidth: "150px", marginLeft: "20px" }}
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

                      const isSelected =
                        selectedDate &&
                        selectedDate.toDateString() === date.toDateString();

                      return (
                        <div
                          key={i}
                          className={`date-block ${isSelected ? "selected" : ""}`}
                          onClick={() => {
                            if (isSelected) setSelectedDate(null);
                            else
                              setSelectedDate(
                                new Date(
                                  date.getFullYear(),
                                  date.getMonth(),
                                  date.getDate()
                                )
                              );
                          }}
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
                <Form.Label>
                  Horarios de Función<span className="text-danger">*</span>
                </Form.Label>
                <div className="d-flex flex-wrap align-items-center gap-2">
                  <Form.Select
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value) handleAddShowtime(value);
                      e.target.value = "";
                    }}
                    value=""
                    style={inputStyle}
                  >
                    <option value="">Seleccionar horario...</option>
                    {allTimes.map((t) => {
                      if (!selectedDate) return <option key={t} value={t}>{t}</option>;

                      const dateStr = formatDate(selectedDate);
                      const durationInt = parseInt(duration, 10) || 0;
                      const newStart = toMinutes(dateStr, t);
                      const newEnd = newStart + durationInt;

                      const now = new Date();
                      const isToday =
                        selectedDate.getFullYear() === now.getFullYear() &&
                        selectedDate.getMonth() === now.getMonth() &&
                        selectedDate.getDate() === now.getDate();

                      const [h, m] = t.split(":").map(Number);
                      const timeInMinutes = h * 60 + m;
                      const nowMinutes = now.getHours() * 60 + now.getMinutes();

                      const isPast = isToday && timeInMinutes <= nowMinutes;

                      const conflicto = occupied.find((o) => {
                        const occStart = toMinutes(o.date, o.time);
                        const occEnd = occStart + parseInt(o.duration || durationInt, 10);
                        return rangesOverlap(newStart, newEnd, occStart, occEnd);
                      });
                      const ocupado = Boolean(conflicto);

                      const disabled = ocupado || isPast;

                      return (
                        <option key={t} value={t} disabled={disabled}>
                          {t}
                          {isPast
                            ? " ⏰ (Horario pasado)"
                            : ocupado
                              ? ` ⛔ (Ocupado por ${conflicto.title})`
                              : ""}
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
                          onClick={() => handleRemoveShowtime(s.time, s.date)}
                        >
                          ❌
                        </Button>
                      </span>
                    ))}
                  </div>
                </div>
                <Form.Text className="text-secondary small mt-1 d-block">
                  💡 Si no seleccionas fecha ni horario, la película se cargará
                  automáticamente en <strong>Próximos Estrenos</strong>.
                </Form.Text>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3" controlId="imageUrl">
                <Form.Label>
                  URL de Imagen<span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingresar URL de imagen"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  style={inputStyle}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3" controlId="bannerUrl">
                <Form.Label>
                  URL de Banner<span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingresar URL del banner"
                  value={bannerUrl}
                  onChange={(e) => setBannerUrl(e.target.value)}
                  style={inputStyle}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="justify-content-end">
            <Col
              md={3}
              className="d-flex flex-column justify-content-end align-items-end"
            >
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
      <SimpleAlert
        show={alertShow}
        message={alertMessage}
        variant={alertVariant}
        onClose={() => setAlertShow(false)}
        duration={4000}
      />

    </Card>
  );
};

export default MovieForm;