import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Card, Form, Row, Col, Button, Badge } from "react-bootstrap";
import "./EditMovieForm.css";
import SimpleAlert from "../SimpleAlert";

const EditMovieForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [director, setDirector] = useState("");
  const [category, setCategory] = useState("");
  const [summary, setSummary] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [duration, setDuration] = useState("");
  const [language, setLanguage] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [showtimes, setShowtimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [alertShow, setAlertShow] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("info");

  const showAlert = (message, variant = "info", duration = 4000) => {
    setAlertMessage(message);
    setAlertVariant(variant);
    setAlertShow(true);
    setTimeout(() => setAlertShow(false), duration);
  };


  const formatDate = (d) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const generateTimeSlots = () => {
    const times = [];
    for (let h = 0; h < 24; h++) {
      times.push(`${h.toString().padStart(2, "0")}:00`);
    }
    return times;
  };

  const allTimes = generateTimeSlots();

  const toMinutes = (dateStr, timeStr) => {
    const date = new Date(`${dateStr}T${timeStr}:00`);
    return date.getTime() / 60000;
  };

  const rangesOverlap = (aStart, aEnd, bStart, bEnd) =>
    aStart < bEnd && aEnd > bStart;

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await fetch(`http://localhost:3000/movies/${id}`);
        if (!res.ok) throw new Error("No se pudo cargar la película");
        const data = await res.json();

        setMovie(data);

        setTitle(data.title || "");
        setDirector(data.director || "");
        setCategory(data.category || "");
        setSummary(data.summary || "");
        setImageUrl(data.imageUrl || "");
        setBannerUrl(data.bannerUrl || "");
        setDuration(data.duration || "");
        setLanguage(data.language || "");
        setIsAvailable(data.isAvailable ?? true);

        const formattedShowtimes = (data.showtimes || []).map((s) =>
          typeof s === "string" ? { date: null, time: s } : { date: s.date, time: s.time }
        );
        setShowtimes(formattedShowtimes);

        const firstWithDate = formattedShowtimes.find((s) => s.date);
        if (firstWithDate) setSelectedDate(new Date(firstWithDate.date));
      } catch (err) {
        console.error(err);
        showAlert("Error cargando la película", "danger");
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

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
        showAlert(`El horario ${time} (${dateStr}) se solapa con ${s.time} (${s.date}).`, "danger");
        return;
      }
    }

    const newShowtimes = [...showtimes, { date: dateStr, time }];
    setShowtimes(newShowtimes);


    setIsAvailable(newShowtimes.some(s => s.time && s.date));
  };

  const handleRemoveShowtime = (time, date) => {
    const newShowtimes = showtimes.filter((s) => !(s.time === time && s.date === date));
    setShowtimes(newShowtimes);

    setIsAvailable(newShowtimes.some(s => s.time && s.date));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const validShowtimes = showtimes
      .filter(s => s.time)
      .map((s) => ({ date: s.date || null, time: s.time }));


    const available = validShowtimes.some(s => s.time && s.date);

    const updatedMovie = {
      title: title || "",
      director: director || "",
      category: category || "",
      summary: summary || "",
      imageUrl: imageUrl || "",
      bannerUrl: bannerUrl || "",
      duration: parseInt(duration, 10) || 0,
      language: language || "",
      isAvailable: available,
      showtimes: validShowtimes,
    };

    try {
      const token = localStorage.getItem("cine-tup-token");
      const res = await fetch(`http://localhost:3000/movies/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedMovie),
      });

      const data = await res.json();

      if (!res.ok) {
        showAlert(data.message || "Error al actualizar la película", "danger");
        return;
      }

      if (!res.ok) {
        showAlert(data.message || "Error al actualizar la película", "danger");
        return;
      }

      sessionStorage.setItem(
        "alert",
        JSON.stringify({ message: "Película actualizada correctamente", variant: "success" })
      );

      navigate("/editar");
    } catch (err) {
      console.error("Error updating movie:", err);
      showAlert("Error al actualizar la película", "danger");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-center mt-4">Cargando...</p>;

  return (
    <Card className="edit-movie-card">
      <Card.Body>
        <h2 className="mb-4">Editar Película</h2>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Título</Form.Label>
                <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Director</Form.Label>
                <Form.Control type="text" value={director} onChange={(e) => setDirector(e.target.value)} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Categoría</Form.Label>
                <Form.Control type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Idioma</Form.Label>
                <Form.Control type="text" value={language} onChange={(e) => setLanguage(e.target.value)} />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Resumen</Form.Label>
                <Form.Control as="textarea" rows={3} value={summary} onChange={(e) => setSummary(e.target.value)} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Duración (min)</Form.Label>
                <Form.Control type="number" value={duration} onChange={(e) => setDuration(e.target.value)} />
              </Form.Group>
            </Col>

            {/* Fechas */}
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Fecha de Función</Form.Label>
                <div className="d-flex gap-2 flex-wrap">
                  {[...Array(6)].map((_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() + i);
                    const label = date.toLocaleDateString("es-AR", { weekday: "short", day: "numeric", month: "short" });
                    const isSelected = selectedDate && selectedDate.toDateString() === date.toDateString();
                    return (
                      <div key={i} className={`date-block ${isSelected ? "selected" : ""}`}
                        onClick={() => setSelectedDate(isSelected ? null : new Date(date.getFullYear(), date.getMonth(), date.getDate()))}>
                        {label}
                      </div>
                    );
                  })}
                </div>
              </Form.Group>
            </Col>

            {/* Horarios */}
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Horarios</Form.Label>
                <Form.Select onChange={(e) => { if (e.target.value) handleAddShowtime(e.target.value); e.target.value = "" }} value="">
                  <option value="">Seleccionar horario...</option>
                  {allTimes.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </Form.Select>
                <div className="d-flex flex-wrap gap-2 mt-2">
                  {showtimes.map(s => (
                    <span key={`${s.date}-${s.time}`} className="badge bg-info text-dark">
                      {s.time} {s.date ? `(${s.date})` : "(sin fecha)"}
                      <Button variant="link" size="sm" className="ms-1 p-0" onClick={() => handleRemoveShowtime(s.time, s.date)}>❌</Button>
                    </span>
                  ))}
                </div>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>URL de Imagen</Form.Label>
                <Form.Control type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>URL de Banner</Form.Label>
                <Form.Control type="text" value={bannerUrl} onChange={(e) => setBannerUrl(e.target.value)} />
              </Form.Group>
            </Col>
          </Row>

          <Button type="submit" disabled={saving}>{saving ? "Guardando..." : "Guardar Cambios"}</Button>
          <Button variant="secondary" className="ms-2" onClick={() => navigate("/editar")}>Volver</Button>
        </Form>
      </Card.Body>
      <SimpleAlert
        show={alertShow}
        variant={alertVariant}
        message={alertMessage}
        onClose={() => setAlertShow(false)}
        duration={4000}
      />

    </Card>
  );
};

export default EditMovieForm;
