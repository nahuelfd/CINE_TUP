import { Movie } from "../entities/Movie.js";

import { ERROR_CODE } from "../errorCodes.js";

export const findMovies = async (_, res) => {
  const movies = await Movie.findAll();
  res.json(movies);
};

export const findMovie = async (req, res) => {
  const { id } = req.params;

  const movie = await Movie.findByPk(id);

  if (!movie)
    return res
      .status(ERROR_CODE.NOT_FOUND)
      .send({ message: "Pelicula no encontrada" });

  res.json(movie);
};

export const createMovie = async (req, res) => {
  const { title, director, category, summary, imageUrl, duration, lenguage, isAvailable } = req.body;

  if (!title || !director)
    return res
      .status(ERROR_CODE.BAD_REQUEST)
      .send({ message: "Título y director son campos requeridos" });

  const newMovie = await Movie.create({
    title, 
    director, 
    category, 
    summary, 
    imageUrl, 
    duration,
    lenguage,
    isAvailable
  });

  res.json(newmovie);
};

export const updateMovie = async (req, res) => {

    const { id } = req.params;

  const { title, director, category, summary, imageUrl, duration, lenguage, isAvailable } =
    req.body;


  if (!title || !director)
    return res
      .status(ERROR_CODE.BAD_REQUEST)
      .send({ message: "Título y autor son campos requeridos" });

  const movie = await Movie.findByPk(id);

  await movie.update({
    title, 
    director, 
    category, 
    summary, 
    imageUrl, 
    duration,
    lenguage,
    isAvailable
  });

  await movie.save();

  res.send(movie);
};

export const deleteMovie = async (req, res) => {
  const { id } = req.params;

export const deleteMovie = async (req, res) => {

  if (!movie)
    return res
      .status(ERROR_CODE.NOT_FOUND)
      .send({ message: "Pelicula no encontrada" });

  await movie.destroy();

  res.send(`Borrando pelicula con ID ${id}`);
};
