import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";

import { config } from "./config.js"; // ahora sí tomará los valores de env
import { sequelize } from "./db.js";

import movieRoutes from "./routes/movie.routes.js";
import userRoutes from "./routes/user.routes.js";
import ticketRoutes from "./routes/ticket.routes.js";

import "./entities/Movie.js";
import "./entities/User.js";
import "./entities/Ticket.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") }); // apunta a cine_tup_server/.env

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Parsear JSON
app.use(express.json());

// Rutas
app.use(movieRoutes);
app.use(userRoutes);
app.use(ticketRoutes);

// Inicializar base de datos y servidor
try {
  await sequelize.sync();
  app.listen(config.port, () => {
    console.log(`Server listening on port ${config.port}`);
    console.log("DB storage:", config.db.storage);
    console.log("JWT_SECRET:", config.jwtSecret ? "✅ definido" : "❌ undefined");
  });
} catch (error) {
  console.error("Error initializing server:", error);
}