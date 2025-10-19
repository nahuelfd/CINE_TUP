import express from "express";

import movieRoutes from "./routes/movie.routes.js";
import userRoutes from "./routes/user.routes.js";
import ticketRoutes from "./routes/ticket.routes.js";
import { sequelize } from "./db.js";
import dotenv from "dotenv";
import cors from "cors";

import "./entities/Movie.js";
dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();

try {
  app.use(express.json());
  app.use(
    cors({
      origin: "http://localhost:5173",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  app.use(movieRoutes);
  app.use(userRoutes);
  app.use(ticketRoutes);

  await sequelize.sync();

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
} catch (error) {
  console.log("There were some errors on initialization");
}
