import { Router } from "express";

import { createMovie, deleteMovie, findMovie, findMovies, updateMovie, getOccupiedTimes } from "../services/movie.service.js";

import { verifyToken } from "../utils/auth.js";

const router = Router();

router.get("/movies/occupied-times", getOccupiedTimes);


router.get("/movies", findMovies);
router.get("/movies/:id", findMovie);
router.post("/movies", verifyToken, createMovie);
router.put("/movies/:id",verifyToken,  updateMovie);
router.delete("/movies/:id",  deleteMovie);

 

export default router;