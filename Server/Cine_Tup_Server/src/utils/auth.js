import jwt from "jsonwebtoken";
import { config } from "../config.js";

export const verifyToken = (req, res, next) => {
  const header = req.header("Authorization") || "";
  const token = header.split(" ")[1];

  if (!token)
    return res.status(401).json({ message: "No posee autorización requerida" });

  try {
    const payload = jwt.verify(token, config.jwtSecret);
    req.user = payload; 
    next();
  } catch (error) {
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