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
    return res
      .status(ERROR_CODE.NOT_FOUND)
      .send({ message: "Ticket no encontrado" });

  res.json(ticket);
};

export const createTicket = async (req, res) => {
  const { seatNumber, price, movieId, userId } = req.body;

  if (!seatNumber || !price || !movieId || !userId)
    return res
      .status(ERROR_CODE.BAD_REQUEST)
      .send({ message: "Campos requeridos faltantes" });

  const newTicket = await Ticket.create({
    seatNumber,
    price,
    movieId,
    userId,
  });

  res.json(newTicket);
};

export const updateTicket = async (req, res) => {
  const { id } = req.params;
  const { seatNumber, price } = req.body;

  const ticket = await Ticket.findByPk(id);

  if (!ticket)
    return res
      .status(ERROR_CODE.NOT_FOUND)
      .send({ message: "Ticket no encontrado" });

  await ticket.update({ seatNumber, price });
  await ticket.save();

  res.json(ticket);
};

export const deleteTicket = async (req, res) => {
  const { id } = req.params;

  const ticket = await Ticket.findByPk(id);

  if (!ticket)
    return res
      .status(ERROR_CODE.NOT_FOUND)
      .send({ message: "Ticket no encontrado" });

  await ticket.destroy();

  res.send(`Borrando ticket con ID ${id}`);
};