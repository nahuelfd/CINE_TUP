import { Ticket } from "../entities/Ticket.js";
import { Movie } from "../entities/Movie.js";
import { User } from "../entities/User.js";
import { ERROR_CODE } from "../errorCodes.js";

export const findTickets = async (_, res) => {
  const tickets = await Ticket.findAll({ include: [Movie, User] });
  res.json(tickets);
};

export const findTicket = async (req, res) => {
  const { id } = req.params;

  const ticket = await Ticket.findByPk(id, { include: [Movie, User] });

  if (!ticket)
    return res.status(ERROR_CODE.NOT_FOUND).json({ message: "Ticket no encontrado" });

  res.json(ticket);
};

export const createTicket = async (req, res) => {
  try {
    const { seatNumber, movieId, showtime } = req.body;
    const userId = req.user.id;

    if (!seatNumber || !movieId || !showtime) {
      return res.status(400).json({ message: "seatNumber, movieId y showtime son requeridos" });
    }

    const ticket = await Ticket.findOne({ where: { movieId, seatNumber, showtime } });

    if (!ticket)
      return res.status(404).json({ message: "Butaca no encontrada" });

    if (!ticket.isAvailable)
      return res.status(400).json({ message: "El asiento ya está ocupado" });

    await ticket.update({
      isAvailable: false,
      userId,
      purchaseDate: new Date(),
    });

    res.json(ticket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al comprar ticket" });
  }
};

export const updateTicket = async (req, res) => {
  const { id } = req.params;
  const { seatNumber, price } = req.body;

  const ticket = await Ticket.findByPk(id);

  if (!ticket)
    return res.status(ERROR_CODE.NOT_FOUND).json({ message: "Ticket no encontrado" });

  await ticket.update({ seatNumber, price });
  res.json(ticket);
};

export const deleteTicket = async (req, res) => {
  const { id } = req.params;

  const ticket = await Ticket.findByPk(id);

  if (!ticket)
    return res.status(ERROR_CODE.NOT_FOUND).json({ message: "Ticket no encontrado" });

  await ticket.destroy();

  res.json({ message: `Ticket con ID ${id} eliminado` });
};

export const findTicketsByMovie = async (req, res) => {
  try {
    const movieId = parseInt(req.params.id);
    console.log("findTicketsByMovie: requested movieId =", movieId);
    const tickets = await Ticket.findAll({ where: { movieId } });
    console.log(`findTicketsByMovie: found ${tickets.length} tickets for movieId ${movieId}`);
    res.json(tickets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los tickets" });
  }
};