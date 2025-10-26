import { Router } from "express";

import { createMovie, deleteMovie, findMovie, findMovies, updateMovie } from "../services/movie.service.js";

import { verifyToken } from "../utils/auth.js";

const router = Router();

router.get("/movies", findMovies);
router.get("/movie/:id", findMovie);
router.post("/movies", verifyToken, createMovie);
router.put("/movie/:id",verifyToken,  updateMovie);
router.delete("/movie/:id",verifyToken,  deleteMovie);

 

export default router;