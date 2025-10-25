import { Router } from "express";
import {
  createTicket,
  deleteTicket,
  findTicket,
  findTickets,
  updateTicket,
} from "../services/ticket.service.js";
import { verifyToken, isAdmin, isSysAdmin, isUsuario } from "../utils/auth.js";

const router = Router();

router.get("/ticket", verifyToken, isUsuario, findTickets);
router.get("/ticket/:id", verifyToken, isUsuario, findTicket);

router.post("/ticket", verifyToken, isUsuario, createTicket);

router.put("/ticket/:id", verifyToken, isAdmin, updateTicket);

router.delete("/ticket/:id", verifyToken, isSysAdmin, deleteTicket);

export default router;