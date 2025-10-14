import express from "express";

import movieRoutes from './routes/movie.routes.js';
import { sequelize } from "./db.js";
import dotenv from "dotenv";


import './entities/Movie.js';
dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();

try {
    app.use(express.json());
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "*");
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
        next();
    })

    app.listen(PORT);
    app.use(movieRoutes);

    await sequelize.sync();

    console.log(`Server listening on port ${PORT}`)


} catch (error) {
    console.log("There were some errors on initialization")
}