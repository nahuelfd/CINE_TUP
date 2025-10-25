import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

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



const app = express();

app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

app.use(movieRoutes);
app.use(userRoutes);
app.use(ticketRoutes);

try {
  await sequelize.sync();
  app.listen(config.port, () => {
    console.log(`Server listening on port ${config.port}`);
  });
} catch (error) {
  console.error("Error initializing server:", error);
}