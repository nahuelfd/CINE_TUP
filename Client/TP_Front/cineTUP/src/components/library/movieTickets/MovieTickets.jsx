import { useEffect, useState } from "react";
import useFetch from "../../../useFetch/useFetch";
import { useParams } from "react-router-dom";
import "./MovieTickets.css";
import SimpleAlert from "../../SimpleAlert";

const MovieTickets = () => {
  const { id } = useParams();
  const { get, post, isLoading } = useFetch();

  const [tickets, setTickets] = useState([]);
  const [movie, setMovie] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [alertShow, setAlertShow] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("info");

  const showAlert = (message, variant = "info", duration = 4000) => {
    setAlertMessage(message);
    setAlertVariant(variant);
    setAlertShow(true);
    setTimeout(() => setAlertShow(false), duration);
  };

  // Traer tickets (todos para la movie; frontend filtrará por showtime)
  useEffect(() => {
    let isMounted = true;
    const fetchTickets = async () => {
      try {
        const data = await get(`/tickets/movie/${id}`, true);
        if (isMounted && data) setTickets(data);
      } catch (err) {
        console.error("Error fetching tickets:", err);
      }
    };
    fetchTickets();
    return () => { isMounted = false; };
    // intentionally only depend on `id` to avoid re-running if `get` changes reference
  }, [id]);

  // Traer película
  useEffect(() => {
    let isMounted = true;
    const fetchMovie = async () => {
      try {
        const data = await get(`/movies/${id}`, true);
        if (isMounted && data) setMovie(data);
      } catch (err) {
        console.error("Error fetching movie:", err);
      }
    };
    fetchMovie();
    return () => { isMounted = false; };
    // intentionally only depend on `id` to avoid re-running if `get` changes reference
  }, [id]);

  const handleSeatSelect = (ticketId) => {
    setSelectedSeats((prev) =>
      prev.includes(ticketId) ? prev.filter((s) => s !== ticketId) : [...prev, ticketId]
    );
  };

  // Compra sencilla: por cada asiento, hacemos POST /ticket con seatNumber, movieId, showtime
  const handlePurchase = async () => {
    if (!selectedSeats.length) {
      showAlert("Seleccioná al menos una butaca", "warning");
      return;
    }

    const token = localStorage.getItem("cine-tup-token");
    if (!token) {
      showAlert("Debes iniciar sesión para comprar tickets", "warning");
      return;
    }

    setProcessing(true);
    try {
      for (const ticketId of selectedSeats) {
        const t = tickets.find((x) => x.id === ticketId);
        if (!t) continue;

        await post("/ticket", true, {
          seatNumber: t.seatNumber,
          movieId: t.movieId,
          showtime: t.showtime,
        });
      }

      showAlert("Compra realizada con éxito", "success");

      // refrescar tickets
      const updated = await get(`/tickets/movie/${id}`, true);
      setTickets(updated || []);
      setSelectedSeats([]);
    } catch (err) {
      console.error("Error al comprar:", err);
      showAlert(err?.message || "Error al comprar los tickets", "danger");
    } finally {
      setProcessing(false);
    }
  };

  if (isLoading || !movie) return <div className="movie-tickets__loading">Cargando...</div>;

  const filteredTickets = selectedTime
    ? tickets.filter((t) => {
      const date = t.showDate || t.showtime?.date;
      const time = t.showtime?.time || t.showtime;

      return date === selectedTime.date && time === selectedTime.time;
    })
    : [];



  // Agrupar por fila
  const rows = {};
  filteredTickets.forEach((ticket) => {
    const row = ticket.seatNumber ? ticket.seatNumber[0] : "?";
    if (!rows[row]) rows[row] = [];
    rows[row].push(ticket);
  });

  return (
    <div className="movie-tickets__container">
      <h1 className="movie-tickets__title">{movie.title}</h1>

      <div className="movie-tickets__main">
        {/* IZQUIERDA */}
        <div className="movie-tickets__info">
          <img src={movie.imageUrl} alt={movie.title} className="movie-tickets__poster" />
          <div className="movie-tickets__details">
            <p><strong>Categoría:</strong> {movie.category || "Sin categoría"}</p>
            <p><strong>Duración:</strong> {movie.duration ? `${movie.duration} min` : "N/A"}</p>
            <p><strong>Idioma:</strong> {movie.language || "Desconocido"}</p>
            <p><strong>Director:</strong> {movie.director || "No especificado"}</p>
            <p><strong>Resumen:</strong></p>
            <p className="movie-tickets__summary">{movie.summary || "Sin descripción disponible."}</p>
          </div>
        </div>

        {/* DERECHA */}
        <div className="movie-tickets__seats">
          <div className="movie-tickets__showtimes">
            <h3>Seleccionar horario</h3>
            <div className="d-flex flex-wrap justify-content-center gap-3">
              {movie.showtimes && movie.showtimes.length > 0 ? (
                movie.showtimes.map((s, i) => (
                  <div
                    key={`${s.date}-${s.time}-${i}`}
                    className={`showtime-card ${selectedTime?.date === s.date && selectedTime?.time === s.time
                      ? "selected"
                      : ""
                      }`}
                    onClick={() => {
                      setSelectedTime(s);
                      setSelectedSeats([]);
                    }}
                  >
                    <div className="showtime-time">{s.time} hs</div>
                    <div className="showtime-date">{s.date}</div>
                  </div>
                ))
              ) : (
                <p>No hay horarios configurados.</p>
              )}
            </div>
          </div>



          <div className="movie-tickets__seat-section">
            <h2>Asientos disponibles</h2>


            {!selectedTime ? (
              <p className="movie-tickets__hint">Selecciona un horario para ver los asientos.</p>
            ) : Object.keys(rows).length === 0 ? (
              <p>No hay tickets disponibles para este horario.</p>
            ) : (
              Object.keys(rows).map((row) => (
                <div className="ticket-row" key={row}>
                  {rows[row].map((ticket) => (
                    <button
                      key={ticket.id}
                      className={`ticket-btn ${ticket.isAvailable ? "available" : "unavailable"} ${selectedSeats.includes(ticket.id) ? "selected" : ""}`}
                      disabled={!ticket.isAvailable || processing}
                      onClick={() => handleSeatSelect(ticket.id)}
                    >
                      {ticket.seatNumber}
                    </button>
                  ))}
                </div>
              ))
            )}

            {selectedSeats.length > 0 && (
              <div className="purchase-section">
                <p>Butacas seleccionadas: {selectedSeats.length}</p>
                <button className="buy-btn" onClick={handlePurchase} disabled={processing}>
                  {processing ? "Procesando..." : `Comprar ${selectedSeats.length}`}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <SimpleAlert
        show={alertShow}
        message={alertMessage}
        variant={alertVariant}
        onClose={() => setAlertShow(false)}
        duration={4000}
      />

    </div>
  );
};

export default MovieTickets;
