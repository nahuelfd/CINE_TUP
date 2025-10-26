import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../entities/User.js";
import { validateEmail, validatePassword, validateString } from "../utils/validations.js";
import { config } from "../config.js"; 


export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!validateString(name, 2, 50))
      return res.status(400).json({ message: "Nombre inválido (2-50 caracteres)." });

    if (!validateEmail(email))
      return res.status(400).json({ message: "Email inválido." });

    if (!validatePassword(password, 7, 20, true, true))
      return res.status(400).json({
        message:
          "Contraseña inválida. Debe tener entre 7 y 20 caracteres, incluir al menos una mayúscula y un número.",
      });

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: "Usuario existente." });

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });

    const payload = { id: newUser.id, email: newUser.email, role: newUser.role };
    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiration });


    return res.status(201).json({
      message: `El usuario ${name} se ha registrado correctamente.`,
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Error en el servidor." });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!validateEmail(email)) return res.status(401).json({ message: "Email inválido." });

    if (!validatePassword(password, 7, 20, true, true))
      return res.status(401).json({ message: "Contraseña inválida." });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: "Usuario no existente." });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Contraseña incorrecta." });

    const payload = { id: user.id, email: user.email, role: user.role };
    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiration });

    return res.status(200).json({
      message: "Login exitoso",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Error en el servidor." });
  }
};
