import { Movie } from "../entities/Movie.js";
import { ERROR_CODE } from "../errorCodes.js";

export const findMovies = async (_, res) => {
  try {
    const movies = await Movie.findAll();
    res.json(movies);
  } catch (err) {
    console.error("Error fetching movies:", err);
    res.status(500).json({ message: "Error al obtener películas" });
  }
};

export const findMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await Movie.findByPk(id);

    if (!movie)
      return res
        .status(ERROR_CODE.NOT_FOUND)
        .json({ message: "Pelicula no encontrada" });

    res.json(movie);
  } catch (err) {
    console.error("Error fetching movie:", err);
    res.status(500).json({ message: "Error al obtener la película" });
  }
};

export const createMovie = async (req, res) => {
  try {
    const { title, director, category, summary, imageUrl, duration, language, isAvailable } = req.body;

    if (!title || !director)
      return res
        .status(ERROR_CODE.BAD_REQUEST)
        .json({ message: "Título y director son campos requeridos" });

    const newMovie = await Movie.create({
      title, 
      director, 
      category, 
      summary, 
      imageUrl, 
      duration,
      language,
      isAvailable
    });

    res.json(newMovie);
  } catch (err) {
    console.error("Error creating movie:", err);
    res.status(500).json({ message: "Error al crear película" });
  }
};

export const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, director, category, summary, imageUrl, duration, language, isAvailable } = req.body;

    if (!title || !director)
      return res
        .status(ERROR_CODE.BAD_REQUEST)
        .json({ message: "Título y director son campos requeridos" });

    const movie = await Movie.findByPk(id);

    if (!movie)
      return res
        .status(ERROR_CODE.NOT_FOUND)
        .json({ message: "Pelicula no encontrada" });

    await movie.update({
      title, 
      director, 
      category, 
      summary, 
      imageUrl, 
      duration,
      language,
      isAvailable
    });

    res.json(movie);
  } catch (err) {
    console.error("Error updating movie:", err);
    res.status(500).json({ message: "Error al actualizar película" });
  }
};

export const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await Movie.findByPk(id);

    if (!movie)
      return res
        .status(ERROR_CODE.NOT_FOUND)
        .json({ message: "Pelicula no encontrada" });

    await movie.destroy();
    res.json({ message: `Pelicula con ID ${id} eliminada` });
  } catch (err) {
    console.error("Error deleting movie:", err);
    res.status(500).json({ message: "Error al eliminar película" });
  }
};
