import { useEffect, useState, useCallback } from "react";
import "./Tickets.css";
import SimpleAlert from "../SimpleAlert";

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("cine-tup-token");
  const [alertShow, setAlertShow] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("info");

  // Función para mostrar alertas
  const showAlert = (message, variant = "info", duration = 4000) => {
    setAlertMessage(message);
    setAlertVariant(variant);
    setAlertShow(true);
    setTimeout(() => setAlertShow(false), duration);
  };

  // Función para mostrar confirmación (devuelve una promesa)
  const showConfirm = (message) => {
    return new Promise((resolve) => {
      const confirmed = window.confirm(message); // o reemplazar por un modal si quieres
      resolve(confirmed);
    });
  };

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
    const confirmed = await showConfirm("¿Seguro que querés cancelar este ticket?");
    if (!confirmed) return;

    try {
      const res = await fetch(`http://localhost:3000/tickets/cancel/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!res.ok) {
        showAlert(data.message || "Error al cancelar", "danger");
        return;
      }

      showAlert("Ticket cancelado con éxito", "success");
      setTickets((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
      showAlert("Error de conexión al cancelar ticket", "danger");
    }
  };

  if (message) return <p>{message}</p>;

  return (
    <div className="my-tickets-container">
      <h2>Mis Tickets</h2>
      {tickets.length === 0 ? (
        <p className= "no-tickets-message">No tenés tickets comprados.</p>
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

export default MyTickets;
