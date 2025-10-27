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

router.put("/users/:id/role", verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    user.role = role;
    await user.save();

    // Excluimos el password antes de devolver el usuario actualizado
    const { password, ...userData } = user.toJSON();
    res.json(userData);
  } catch (error) {
    console.error("Error al actualizar el rol:", error);
    res.status(500).json({ message: "Error al cambiar el rol" });
  }
});

router.put("/users/:id/suspend", verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { active } = req.body; // booleano para alternar

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    user.active = active;
    await user.save();

    const { password, ...userData } = user.toJSON();
    res.json(userData);
  } catch (error) {
    console.error("Error al suspender/reactivar usuario:", error);
    res.status(500).json({ message: "Error al actualizar estado del usuario" });
  }
});

export default router;
