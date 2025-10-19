import { Router } from "express";
import { createTicket, deleteTicket, findTicket, findTickets, updateTicket } from "../services/ticket.service.js";
import { verifyToken } from "../utils/auth.js";

const router = Router();

router.get("/ticket", verifyToken, findTickets);
router.get("/ticket/:id", verifyToken, findTicket);
router.post("/ticket", verifyToken, createTicket);
router.put("/ticket/:id", verifyToken, updateTicket);
router.delete("/ticket/:id", verifyToken, deleteTicket);

export default router;