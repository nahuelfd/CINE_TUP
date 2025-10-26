import { useParams } from "react-router";
import { useState, useEffect } from "react";
import useFetch from "../../../useFetch/useFetch";

const MovieTickets = () => {
  const { id } = useParams();
  const { get, post } = useFetch(); 
  const [tickets, setTickets] = useState([]);
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("cine-tup-token");
  const userId = localStorage.getItem("userId");

  // Trae tickets desde la BD al cargar la página
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await get(`/tickets/movie/${id}`, true);
        setTickets(data);
      } catch (error) {
        console.error("Error al cargar tickets:", error);
      }
    };
    fetchTickets();
  }, [id]);

  const toggleTicket = (ticketId) => {
    setSelectedTickets(prev =>
      prev.includes(ticketId)
        ? prev.filter(id => id !== ticketId)
        : [...prev, ticketId]
    );
  };

  const buyTickets = async () => {
    if (!token || !userId) {
      alert("Debes iniciar sesión para comprar tickets");
      return;
    }

    try {
      setLoading(true);

      for (const ticket of selectedTickets) {
        await post(
          "/ticket",
          true,
          { seatNumber: ticket, price: 10000, movieId: parseInt(id) },
          (data) => console.log("Ticket comprado:", data),
          (err) => { throw new Error(err.message || "Error al comprar ticket"); }
        );
      }

      const updatedTickets = await get(`/tickets/movie/${id}`, true);
      setTickets(updatedTickets);

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
    const rowLetter = ticket.seatNumber[0];
    if (!rows[rowLetter]) rows[rowLetter] = [];
    rows[rowLetter].push(ticket);
  });

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Tickets</h1>

      <div className="row">
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
                    onClick={() => toggleTicket(ticket.seatNumber)}
                  >
                    {ticket.seatNumber}
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {selectedTickets.length > 0 && (
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
