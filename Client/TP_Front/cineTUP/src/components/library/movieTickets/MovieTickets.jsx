import { useEffect, useState } from "react";
import useFetch from "../../../useFetch/useFetch";
import { useParams } from "react-router-dom";
import "./MovieTickets.css";

const MovieTickets = () => {
  const { id } = useParams();
  const { get, isLoading } = useFetch();
  const [tickets, setTickets] = useState([]);
  const [movie, setMovie] = useState(null);

  // Trae los tickets
  useEffect(() => {
    const fetchTickets = async () => {
      console.log("MovieTickets: request tickets for movie id:", id);
      const data = await get(`/tickets/movie/${id}`, true);
      console.log("MovieTickets: received tickets:", data);
      if (data) setTickets(data);
    };
    fetchTickets();
  }, [id]);

  // Trae los detalles de la película
  useEffect(() => {
    const fetchMovie = async () => {
      const data = await get(`/movies/${id}`, true);
      console.log("MovieTickets: received movie:", data);
      if (data) setMovie(data);
    };
    fetchMovie();
  }, [id]);

  if (isLoading || !movie) {
    return <div className="movie-tickets__loading">Cargando...</div>;
  }

  // Agrupar tickets por filas (A, B, C...)
  const rows = {};
  tickets.forEach(ticket => {
    const row = ticket.seatNumber[0];
    if (!rows[row]) rows[row] = [];
    rows[row].push(ticket);
  });

  return (
    <div className="movie-tickets__container">
      {/* TÍTULO ARRIBA DEL TODO */}
      <h1 className="movie-tickets__title">{movie.title}</h1>

      <div className="movie-tickets__main">
        {/* BLOQUE IZQUIERDO: PORTADA + INFO */}
        <div className="movie-tickets__info">
          <img
            src={movie.imageUrl}
            alt={movie.title}
            className="movie-tickets__poster"
          />

          <div className="movie-tickets__details">
            <p><strong>Categoría:</strong> {movie.category || "Sin categoría"}</p>
            <p><strong>Duración:</strong> {movie.duration ? `${movie.duration} min` : "N/A"}</p>
            <p><strong>Idioma:</strong> {movie.language || "Desconocido"}</p>
            <p><strong>Director:</strong> {movie.director || "No especificado"}</p>
            <p><strong>Resumen:</strong></p>
            <p className="movie-tickets__summary">{movie.summary || "Sin descripción disponible."}</p>
          </div>
        </div>

        {/* BLOQUE DERECHO: TICKETS */}
        <div className="movie-tickets__seats">
          <h2>Tickets Disponibles</h2>

          {Object.keys(rows).length === 0 ? (
            <p>No hay tickets disponibles.</p>
          ) : (
            Object.keys(rows).map(row => (
              <div key={row} className="ticket-row">
                {rows[row].map(ticket => (
                  <button
                    key={ticket.id}
                    className={`ticket-btn ${ticket.isAvailable ? "available" : "unavailable"}`}
                    disabled={!ticket.isAvailable}
                  >
                    {ticket.seatNumber}
                  </button>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieTickets;
