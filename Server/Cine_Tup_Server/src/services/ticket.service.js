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
    const { seatNumber, price, movieId } = req.body;
    const userId = req.user.id;

    if (!seatNumber || !price || !movieId || !userId) {
      return res.status(ERROR_CODE.BAD_REQUEST)
        .json({ message: "Campos requeridos faltantes" });
    }

    const existingTicket = await Ticket.findOne({
      where: { movieId, seatNumber }
    });

    if (existingTicket) {
      return res.status(400).json({ message: "El asiento ya está ocupado" });
    }

    const newTicket = await Ticket.create({
      seatNumber,
      price,
      movieId,
      userId,
      isAvailable: false
    });

    res.status(201).json(newTicket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear el ticket" });
  }
};

export const updateTicket = async (req, res) => {
  const { id } = req.params;
  const { seatNumber, price } = req.body;

  const ticket = await Ticket.findByPk(id);

  if (!ticket)
    return res.status(ERROR_CODE.NOT_FOUND).json({ message: "Ticket no encontrado" });

  await ticket.update({ seatNumber, price });
  await ticket.save();

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
    const tickets = await Ticket.findAll({ where: { movieId } });
    res.json(tickets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los tickets" });
  }
};
