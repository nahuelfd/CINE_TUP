import { Router } from "express";
import { register, login } from "../services/user.service.js";
import { verifyToken, isAdmin } from "../utils/auth.js";
import { validateEmail, validatePassword, validateString } from "../utils/validations.js";
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

router.get("/users/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] }, 
    });

    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

router.put("/users/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const { name, email, password } = req.body;
    const errors = [];

    if (name && !validateString(name, 2, 50))
      errors.push("Nombre inválido (2-50 caracteres).");

    if (email && !validateEmail(email))
      errors.push("Email inválido.");

    if (password && password.trim() !== "" && !validatePassword(password, 7, 20, true, true))
      errors.push(
        "Contraseña inválida. Debe tener entre 7 y 20 caracteres, incluir al menos una mayúscula y un número."
      );

    if (errors.length > 0) return res.status(400).json({ message: errors.join(" ") });

    if (name) user.name = name;
    if (email) user.email = email;

    if (password && password.trim() !== "") {
      const bcrypt = await import("bcrypt");
      const isSame = await bcrypt.compare(password, user.password);
      if (isSame)
        return res.status(400).json({
          message: "La nueva contraseña no puede ser igual a la anterior",
          samePassword: true,
        });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    const { password: _, ...userData } = user.toJSON();
    res.json({ message: "Perfil actualizado correctamente", user: userData });
  } catch (error) {
    console.error(error);
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
