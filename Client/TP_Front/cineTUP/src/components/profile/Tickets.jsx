import { useEffect, useState, useCallback } from "react";
import "./Tickets.css";

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("cine-tup-token");

  console.log("Rendering Tickets", tickets);
  const fetchTickets = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:3000/tickets/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "No se pudieron cargar los tickets");
        return;
      }
      setTickets(data);
    } catch (err) {
      console.error(err);
      setMessage("Error de conexión con el servidor");
    }
  }, [token]); // 

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]); 

  const cancelTicket = async (id) => {
    if (!window.confirm("¿Seguro que querés cancelar este ticket?")) return;

    try {
      const res = await fetch(`http://localhost:3000/tickets/cancel/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Error al cancelar");
        return;
      }

      alert("Ticket cancelado con éxito");
      // 🔄 Refrescar lista después de cancelar
      setTickets((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (message) return <p>{message}</p>;

  return (
    <div className="my-tickets-container">
      <h2>Mis Tickets</h2>
      {tickets.length === 0 ? (
        <p>No tenés tickets comprados.</p>
      ) : (
        tickets.map((t) => (
          <div key={t.id} className="ticket-card">
            <p><strong>Película:</strong> {t.movie.title}</p>
            <p><strong>Asiento:</strong> {t.seatNumber}</p>
            <p><strong>Fecha:</strong> {t.showDate}</p>
            <p><strong>Horario:</strong> {t.showtime}</p>
            <button onClick={() => cancelTicket(t.id)}>Cancelar</button>
          </div>
        ))
      )}
    </div>
  );
};

export default MyTickets;
