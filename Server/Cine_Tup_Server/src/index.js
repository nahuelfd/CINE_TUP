import express from "express";

import { PORT } from "./config.js";
import movieRoutes from './routes/movie.routes.js';
import userRoutes from './routes/user.routes.js';
import ticketRoutes from "./routes/ticket.routes.js";
import { sequelize } from "./db.js";

import './entities/Movie.js';
import './entities/User.js';
import './entities/Ticket.js';

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
    app.use(userRoutes);
    app.use(ticketRoutes)
    
    await sequelize.sync();

    console.log(`Server listening on port ${PORT}`)


} catch (error) {
    console.log("There were some errors on initialization")
}