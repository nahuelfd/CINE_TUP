import { Router } from "express";
import { register, login } from "../services/user.service.js";
import { verifyToken, isAdmin } from "../utils/auth.js";
import { User } from "../entities/User.js";

const router = Router();

router.post("/users/register", register);
router.post("/users/login", login);

router.get("/users", verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ["password"] } });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

export default router;
