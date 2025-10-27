import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") }); // apunta a cine_tup_server/.env

import { config } from "./config.js"; // ahora sí tomará los valores de env
import express from "express";
import { sequelize } from "./db.js";
import movieRoutes from "./routes/movie.routes.js";
import userRoutes from "./routes/user.routes.js";
import ticketRoutes from "./routes/ticket.routes.js";

import "./entities/Movie.js";
import "./entities/User.js";
import "./entities/Ticket.js";



import "./entities/Movie.js";
dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());


app.use(express.json());
/*app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});*/

app.use(movieRoutes);
app.use(userRoutes);
app.use(ticketRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

try {
  await sequelize.sync();
  app.listen(config.port, () => {
    console.log(`Server listening on port ${config.port}`);
  });
} catch (error) {
  console.error("Error initializing server:", error);
}
