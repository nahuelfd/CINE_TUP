import { useParams } from "react-router";
import { MOVIES } from "../../../data/data";
import { useState } from "react";

const MovieTickets = () => {
  const { id } = useParams();
  const movie = MOVIES.find(m => m.id === parseInt(id));

  if (!movie) {
    return <p className="text-center mt-4">Película no encontrada.</p>;
  }

  const [selectedTickets, setSelectedTickets] = useState([]);

  const toggleTicket = (ticketId) => {
    setSelectedTickets(prev =>
      prev.includes(ticketId)
        ? prev.filter(id => id !== ticketId)
        : [...prev, ticketId]
    );
  };

  const buyTickets = () => {
    movie.tickets.forEach(ticket => {
      if (selectedTickets.includes(ticket.id)) {
        ticket.isAvailable = false;
      }
    });
    setSelectedTickets([]);
  };

  const rows = {};
  movie.tickets.forEach(ticket => {
    const rowLetter = ticket.seat[0];
    if (!rows[rowLetter]) rows[rowLetter] = [];
    rows[rowLetter].push(ticket);
  });

  return (
    <div className="container mt-4">
      <h1 className="mb-4">{movie.title}</h1>

      <div className="row">
        <div className="col-md-4 text-center mb-3">
          <img
            src={movie.imageUrl}
            alt={movie.title}
            className="img-fluid rounded shadow mb-2"
          />
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
                          ? selectedTickets.includes(ticket.id)
                            ? '#343a40' // un gris oscuro para ticket seleccionado
                            : '#212529' // color del navbar
                          : '#6c757d', // color de ticket no disponible
                        color: 'white',
                        border: 'none',
                        width: '100%',
                        padding: '0.5rem',
                      }}
                      disabled={!ticket.isAvailable}
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
          <p className="text-center mt-4 text-danger">
            Esta película no está disponible por el momento.
          </p>
        )}
      </div>

      {movie.isAvailable && selectedTickets.length > 0 && (
        <div className="text-center mt-4">
          <button className="btn btn-primary" onClick={buyTickets}>
            Comprar {selectedTickets.length} ticket(s)
          </button>
        </div>
      )}
    </div>
  );
};

export default MovieTickets;