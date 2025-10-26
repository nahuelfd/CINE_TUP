import { Router } from "express";
import {
  createTicket,
  deleteTicket,
  findTicket,
  findTickets,
  updateTicket,
  findTicketsByMovie
} from "../services/ticket.service.js";
import { verifyToken, isAdmin, isSysAdmin, isUsuario } from "../utils/auth.js";

const router = Router();
// Acciones de usuario
router.get("/ticket", verifyToken, isUsuario, findTickets);
router.get("/ticket/:id", verifyToken, isUsuario, findTicket);
router.get("/tickets/movie/:id", verifyToken, isUsuario, findTicketsByMovie);
router.post("/ticket", verifyToken, isUsuario, createTicket);
// Acciones de Admin
router.put("/ticket/:id", verifyToken, isAdmin, updateTicket);
// Acciones de SysAdmin
router.delete("/ticket/:id", verifyToken, isSysAdmin, deleteTicket);

export default router;
