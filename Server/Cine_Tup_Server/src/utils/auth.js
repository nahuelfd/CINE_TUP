import jwt from "jsonwebtoken";
import { config } from "../config.js";

export const verifyToken = (req, res, next) => {
  const header = req.header("Authorization") || "";
  console.log("Header recibido:", header);
  const token = header.split(" ")[1];
  console.log("Token extraído:", token);

  if (!token)
    return res.status(401).json({ message: "No posee autorización requerida" });

  try {
    const payload = jwt.verify(token, config.jwtSecret);
    console.log("✅ Token válido, payload:", payload);
    req.user = payload; 
    next();
  } catch (error) {
    console.log("❌ Token inválido o expirado:", error.message);
    return res.status(401).json({ message: "No posee permisos correctos" });
  }
};

export const isSysAdmin = (req, res, next) => {
  if (req.user.role !== "sysadmin")
    return res.status(403).json({ message: "Acceso denegado: solo SysAdmin" });
  next();
};

export const isAdmin = (req, res, next) => {
  if (!["admin", "sysadmin"].includes(req.user.role))
    return res.status(403).json({ message: "Acceso denegado: solo Admin o SysAdmin" });
  next();
};

export const isUsuario = (req, res, next) => {
  if (!["user", "admin", "sysadmin"].includes(req.user.role))
    return res.status(403).json({ message: "Acceso denegado" });
  next();
};