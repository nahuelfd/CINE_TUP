import { useParams } from "react-router";
import { MOVIES } from "../../../data/data";
import { useState } from "react";
import useFetch from "../../../useFetch/useFetch";

const MovieTickets = () => {
  const { id } = useParams();
  const movie = MOVIES.find(m => m.id === parseInt(id));

  const { post } = useFetch(); // nuestro hook para requests
  const [tickets, setTickets] = useState(movie?.tickets || []);
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  if (!movie) return <p className="text-center mt-4">Película no encontrada.</p>;

  const toggleTicket = (ticketId) => {
    setSelectedTickets(prev =>
      prev.includes(ticketId)
        ? prev.filter(id => id !== ticketId)
        : [...prev, ticketId]
    );
  };

  const buyTickets = async () => {
    const token = localStorage.getItem("cinetup-token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      alert("Debes iniciar sesión para comprar tickets");
      return;
    }

    try {
      setLoading(true);

      for (const ticketId of selectedTickets) {
        const ticketData = {
          seatNumber: ticketId,
          price: movie.price || 10000,
          movieId: movie.id,
          userId: parseInt(userId),
        };

        await post(
          "/ticket",
          true, 
          ticketData,
          (data) => console.log("Ticket comprado:", data),
          (err) => { throw new Error(err.message || "Error al comprar ticket"); }
        );
      }

      setTickets(prev =>
        prev.map(ticket =>
          selectedTickets.includes(ticket.id)
            ? { ...ticket, isAvailable: false }
            : ticket
        )
      );

      alert("¡Compra realizada con éxito!");
      setSelectedTickets([]);

    } catch (error) {
      console.error("Error al comprar tickets:", error);
      alert(error.message || "Error al comprar los tickets");
    } finally {
      setLoading(false);
    }
  };

  const rows = {};
  tickets.forEach(ticket => {
    const rowLetter = ticket.seat[0];
    if (!rows[rowLetter]) rows[rowLetter] = [];
    rows[rowLetter].push(ticket);
  });

  return (
    <div className="container mt-4">
      <h1 className="mb-4">{movie.title}</h1>

      <div className="row">
        <div className="col-md-4 text-center mb-3">
          <img src={movie.imageUrl} alt={movie.title} className="img-fluid rounded shadow mb-2" />
          <p><strong>Categoría:</strong> {movie.category}</p>
          <p><strong>Duración:</strong> {movie.duration} min</p>
        </div>

        {movie.isAvailable ? (
          <div className="col-md-8">
            {Object.keys(rows).map(row => (
              <div className="row mb-2" key={row}>
                {rows[row].map(ticket => (
                  <div className="col-1" key={ticket.id}>
                    <button
                      className="btn fw-bold"
                      style={{
                        backgroundColor: ticket.isAvailable
                          ? selectedTickets.includes(ticket.id) ? "#343a40" : "#212529"
                          : "#6c757d",
                        color: "white",
                        border: "none",
                        width: "100%",
                        padding: "0.5rem",
                      }}
                      disabled={!ticket.isAvailable || loading}
                      onClick={() => toggleTicket(ticket.id)}
                    >
                      {ticket.seat}
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center mt-4 text-danger">Esta película no está disponible por el momento.</p>
        )}
      </div>

      {movie.isAvailable && selectedTickets.length > 0 && (
        <div className="text-center mt-4">
          <button className="btn btn-primary" onClick={buyTickets} disabled={loading}>
            {loading ? "Procesando..." : `Comprar ${selectedTickets.length} ticket(s)`}
          </button>
        </div>
      )}
    </div>
  );
};

export default MovieTickets;
