import express from "express";
import movieRoutes from './routes/movie.routes.js';
import userRoutes from './routes/user.routes.js';
import { sequelize } from "./db.js";
import dotenv from "dotenv";
import cors from "cors";


import './entities/Movie.js';
dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();

try {
    app.use(express.json());
    app.use(cors({
    origin: "http://localhost:5173",                // origen permitido (tu frontend Vite)
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
    // credentials: true, // descomentar si vas a usar cookies/sesiones con credenciales
  }));
    // codigo sugerido del profe: *pero no funciona bien
    //*app.use((req, res, next) => {
      //  res.header("Access-Control-Allow-Origin", "*");
      //  res.header("Access-Control-Allow-Headers", "*");
    //    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
     //   next();
    //}) 

    
    app.use(movieRoutes);
    app.use(userRoutes);

    await sequelize.sync();

    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });

    


} catch (error) {
    console.log("There were some errors on initialization")
}