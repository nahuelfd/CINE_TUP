import { Movie } from "../entities/Movie.js";
import { Ticket } from "../entities/Ticket.js";
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

const timeToMinutes = (t) => {
  if (!t) return null;
  const [hh, mm] = t.split(":").map(Number);
  return hh * 60 + mm;
};

const rangesOverlap = (aStart, aEnd, bStart, bEnd) => {
  return aStart < bEnd && aEnd > bStart;
};

export const createMovie = async (req, res) => {
  try {
    const { title, director, category, summary, imageUrl, bannerUrl, duration, language, isAvailable, showtimes } = req.body;

    if (!title || !director)
      return res
        .status(ERROR_CODE.BAD_REQUEST)
        .json({ message: "Título y director son campos requeridos" });

    const newDuration = Number(duration) || 0;
    const newShowtimes = Array.isArray(showtimes) ? showtimes : [];

    const allMovies = await Movie.findAll();
    for (const other of allMovies) {
      const otherDuration = Number(other.duration) || 0;
      const otherShowtimes = Array.isArray(other.showtimes) ? other.showtimes : [];
      for (const newTime of newShowtimes) {
        const newStart = timeToMinutes(newTime);
        const newEnd = newStart + newDuration;
        for (const existingTime of otherShowtimes) {
          const existingStart = timeToMinutes(existingTime);
          const existingEnd = existingStart + otherDuration;
          if (rangesOverlap(newStart, newEnd, existingStart, existingEnd)) {
            return res.status(400).json({
              message: `El horario ${newTime} se superpone con "${other.title}" (${existingTime})`
            });
          }
        }
      }
    }

    const newMovie = await Movie.create({
      title,
      director,
      category,
      summary,
      imageUrl,
      bannerUrl,
      duration: newDuration,
      language,
      isAvailable,
      showtimes: newShowtimes,
    });


    const rows = ["A", "B", "C", "D", "E"];
    const seatsPerRow = 10;
    const tickets = [];

    for (const time of newShowtimes) {
      for (const row of rows) {
        for (let i = 1; i <= seatsPerRow; i++) {
          tickets.push({
            seatNumber: `${row}${i}`,
            price: 10000,
            movieId: newMovie.id,
            isAvailable: true,
            showtime: time,
          });
        }
      }
    }

    if (tickets.length) {
      await Ticket.bulkCreate(tickets);
    }

    res.json({ movie: newMovie, ticketsCreated: tickets.length });


  } catch (err) {
    console.error("Error creating movie:", err);
    res.status(500).json({ message: "Error al crear película" });
  }
};

export const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, director, category, summary, imageUrl, bannerUrl, duration, language, isAvailable, showtimes } = req.body;

    if (!title || !director)
      return res
        .status(ERROR_CODE.BAD_REQUEST)
        .json({ message: "Título y director son campos requeridos" });

    const movie = await Movie.findByPk(id);

    if (!movie)
      return res
        .status(ERROR_CODE.NOT_FOUND)
        .json({ message: "Pelicula no encontrada" });

    const newDuration = Number(duration) || 0;
    const newShowtimes = Array.isArray(showtimes) ? showtimes : [];

    // Validar solapamientos con otras películas (excluyendo esta película)
    const allMovies = await Movie.findAll({ where: { id: { [Movie.sequelize.Op.ne]: movie.id } } });
    for (const other of allMovies) {
      const otherDuration = Number(other.duration) || 0;
      const otherShowtimes = Array.isArray(other.showtimes) ? other.showtimes : [];
      for (const newTime of newShowtimes) {
        const newStart = timeToMinutes(newTime);
        const newEnd = newStart + newDuration;
        for (const existingTime of otherShowtimes) {
          const existingStart = timeToMinutes(existingTime);
          const existingEnd = existingStart + otherDuration;
          if (rangesOverlap(newStart, newEnd, existingStart, existingEnd)) {
            return res.status(400).json({
              message: `El horario ${newTime} se superpone con "${other.title}" (${existingTime})`
            });
          }
        }
      }
    }

    await movie.update({
      title,
      director,
      category,
      summary,
      imageUrl,
      bannerUrl,
      duration: newDuration,
      language,
      isAvailable,
      showtimes: newShowtimes,
    });

    const existingShowtimes = Array.isArray(movie.showtimes) ? movie.showtimes : [];
    const addedShowtimes = newShowtimes.filter(t => !existingShowtimes.includes(t));

    if (addedShowtimes.length) {
      const rows = ["A", "B", "C", "D", "E"];
      const seatsPerRow = 10;
      const tickets = [];

      for (const time of addedShowtimes) {
        for (const row of rows) {
          for (let i = 1; i <= seatsPerRow; i++) {
            tickets.push({
              seatNumber: `${row}${i}`,
              price: 10000,
              movieId: movie.id,
              isAvailable: true,
              showtime: time,
            });
          }
        }
      }

      if (tickets.length) await Ticket.bulkCreate(tickets);
    }

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

export const getOccupiedTimes = async (req, res) => {
  try {
    const movies = await Movie.findAll();

    // Genera un array con todos los rangos ocupados
    const occupied = movies.flatMap(movie => {
      if (!movie.showtimes || !movie.duration) return [];

      const duration = parseInt(movie.duration, 10);

      return movie.showtimes.map(time => {
        const [h, m] = time.split(":").map(Number);
        const start = h * 60 + m;
        const end = start + duration;
        return { start, end, title: movie.title, time };
      });
    });

    res.json(occupied);
  } catch (err) {
    console.error("Error al obtener horarios ocupados:", err);
    res.status(500).json({ message: "Error al obtener horarios ocupados" });
  }
};



