import { Movie } from "../entities/Movie.js";
import { Ticket } from "../entities/Ticket.js";
import { ERROR_CODE } from "../errorCodes.js";

// 🧩 Convierte fecha + hora a minutos absolutos desde epoch
const toAbsoluteMinutes = (dateStr, timeStr) => {
  const date = new Date(`${dateStr}T${timeStr}:00`);
  return date.getTime() / 60000;
};

// 🧮 Verifica si dos rangos de tiempo se solapan
const rangesOverlap = (aStart, aEnd, bStart, bEnd) => aStart < bEnd && aEnd > bStart;

// 🔧 Normaliza el formato de showtime
const normalizeShowItem = (item, defaultDate = null) => {
  if (!item && item !== 0) return null;
  if (typeof item === "string") return { date: defaultDate || null, time: item };
  if (typeof item === "object")
    return { date: item.date || defaultDate || null, time: item.time };
  return null;
};

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
    const {
      title,
      director,
      category,
      summary,
      imageUrl,
      bannerUrl,
      duration,
      language,
      isAvailable,
      showtimes,
      showDate,
    } = req.body;

    if (!title || !director)
      return res
        .status(ERROR_CODE.BAD_REQUEST)
        .json({ message: "Título y director son campos requeridos" });

    const newDuration = Number(duration) || 0;
    const rawShowtimes = Array.isArray(showtimes) ? showtimes : [];
    const newShowtimes = rawShowtimes
      .map((s) => normalizeShowItem(s, showDate))
      .filter(Boolean);

    // 🆕 Validación interna de solapamientos dentro de la misma película
    for (let i = 0; i < newShowtimes.length; i++) {
      const a = newShowtimes[i];
      if (!a.date) continue;
      const aStart = toAbsoluteMinutes(a.date, a.time);
      const aEnd = aStart + newDuration;

      for (let j = i + 1; j < newShowtimes.length; j++) {
        const b = newShowtimes[j];
        if (!b.date) continue;
        const bStart = toAbsoluteMinutes(b.date, b.time);
        const bEnd = bStart + newDuration;

        if (rangesOverlap(aStart, aEnd, bStart, bEnd)) {
          return res.status(400).json({
            message: `Los horarios ${a.time} (${a.date}) y ${b.time} (${b.date}) de esta misma película se solapan entre sí.`,
          });
        }
      }
    }

    // 🧩 Validación contra otras películas
    const allMovies = await Movie.findAll();
    for (const other of allMovies) {
      const otherDuration = Number(other.duration) || 0;
      const otherShowtimesRaw = Array.isArray(other.showtimes)
        ? other.showtimes
        : [];

      const otherShowtimes = otherShowtimesRaw
        .map((s) =>
          typeof s === "string"
            ? { date: null, time: s }
            : { date: s?.date || null, time: s?.time }
        )
        .filter(Boolean);

      for (const newShow of newShowtimes) {
        if (!newShow.date) continue;
        const newStart = toAbsoluteMinutes(newShow.date, newShow.time);
        const newEnd = newStart + newDuration;

        for (const existingShow of otherShowtimes) {
          if (!existingShow.date) continue;
          const existingStart = toAbsoluteMinutes(
            existingShow.date,
            existingShow.time
          );
          const existingEnd = existingStart + otherDuration;

          if (rangesOverlap(newStart, newEnd, existingStart, existingEnd)) {
            return res.status(400).json({
              message: `El horario ${newShow.time} del ${newShow.date} se solapa con "${other.title}" (${existingShow.time} del ${existingShow.date})`,
            });
          }
        }
      }
    }

    // ✅ Crear película y tickets
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

    for (const s of newShowtimes) {
      const time = s.time;
      for (const row of rows) {
        for (let i = 1; i <= seatsPerRow; i++) {
          tickets.push({
            seatNumber: `${row}${i}`,
            price: 10000,
            movieId: newMovie.id,
            isAvailable: true,
            showtime: time,
            showDate: s.date || null,
          });
        }
      }
    }

    if (tickets.length) await Ticket.bulkCreate(tickets);

    res.json({ movie: newMovie, ticketsCreated: tickets.length });
  } catch (err) {
    console.error("Error creating movie:", err);
    res.status(500).json({ message: "Error al crear película" });
  }
};

export const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      director,
      category,
      summary,
      imageUrl,
      bannerUrl,
      duration,
      language,
      isAvailable,
      showtimes,
    } = req.body;

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
    const rawShowtimes = Array.isArray(showtimes) ? showtimes : [];
    const newShowtimes = rawShowtimes
      .map((s) => normalizeShowItem(s, null))
      .filter(Boolean);

    // 🆕 Validación interna dentro de la misma película (en update)
    for (let i = 0; i < newShowtimes.length; i++) {
      const a = newShowtimes[i];
      if (!a.date) continue;
      const aStart = toAbsoluteMinutes(a.date, a.time);
      const aEnd = aStart + newDuration;

      for (let j = i + 1; j < newShowtimes.length; j++) {
        const b = newShowtimes[j];
        if (!b.date) continue;
        const bStart = toAbsoluteMinutes(b.date, b.time);
        const bEnd = bStart + newDuration;

        if (rangesOverlap(aStart, aEnd, bStart, bEnd)) {
          return res.status(400).json({
            message: `Los horarios ${a.time} (${a.date}) y ${b.time} (${b.date}) de esta misma película se solapan entre sí.`,
          });
        }
      }
    }

    // 🧩 Validación contra otras películas
    const allMovies = await Movie.findAll({
      where: { id: { [Movie.sequelize.Op.ne]: movie.id } },
    });

    for (const other of allMovies) {
      const otherDuration = Number(other.duration) || 0;
      const otherShowtimesRaw = Array.isArray(other.showtimes)
        ? other.showtimes
        : [];

      const otherShowtimes = otherShowtimesRaw
        .map((s) =>
          typeof s === "string"
            ? { date: null, time: s }
            : { date: s?.date || null, time: s?.time }
        )
        .filter(Boolean);

      for (const newShow of newShowtimes) {
        if (!newShow.date) continue;
        const newStart = toAbsoluteMinutes(newShow.date, newShow.time);
        const newEnd = newStart + newDuration;

        for (const existingShow of otherShowtimes) {
          if (!existingShow.date) continue;
          const existingStart = toAbsoluteMinutes(
            existingShow.date,
            existingShow.time
          );
          const existingEnd = existingStart + otherDuration;

          if (rangesOverlap(newStart, newEnd, existingStart, existingEnd)) {
            return res.status(400).json({
              message: `El horario ${newShow.time} del ${newShow.date} se solapa con "${other.title}" (${existingShow.time} del ${existingShow.date})`,
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
    const { date } = req.query;
    const movies = await Movie.findAll();

    const pad = (n) => String(n).padStart(2, "0");
    const occupied = [];

    for (const movie of movies) {
      if (!movie.showtimes || !movie.duration) continue;
      const duration = parseInt(movie.duration, 10);

      const normalized = movie.showtimes
        .map((s) =>
          typeof s === "string"
            ? { date: null, time: s }
            : { date: s?.date || null, time: s?.time }
        )
        .filter(Boolean);

      for (const s of normalized) {
        if (!s.date) continue;
        const startDt = new Date(`${s.date}T${s.time}:00`);
        const endDt = new Date(startDt.getTime() + duration * 60 * 1000);

        const startDateStr = `${startDt.getFullYear()}-${pad(
          startDt.getMonth() + 1
        )}-${pad(startDt.getDate())}`;
        const endDateStr = `${endDt.getFullYear()}-${pad(
          endDt.getMonth() + 1
        )}-${pad(endDt.getDate())}`;

        if (!date) {
          const startMin = startDt.getHours() * 60 + startDt.getMinutes();
          const endMin =
            endDateStr === startDateStr
              ? endDt.getHours() * 60 + endDt.getMinutes()
              : 1440;
          occupied.push({
            start: startMin,
            end: endMin,
            title: movie.title,
            time: s.time,
            date: startDateStr,
          });
          if (endDateStr !== startDateStr) {
            const endMinNextDay =
              endDt.getHours() * 60 + endDt.getMinutes();
            occupied.push({
              start: 0,
              end: endMinNextDay,
              title: movie.title,
              time: s.time,
              date: endDateStr,
            });
          }
        } else {
          if (startDateStr === date) {
            const startMin = startDt.getHours() * 60 + startDt.getMinutes();
            const endMin =
              endDateStr === startDateStr
                ? endDt.getHours() * 60 + endDt.getMinutes()
                : 1440;
            occupied.push({
              start: startMin,
              end: endMin,
              title: movie.title,
              time: s.time,
              date: startDateStr,
            });
          }
          if (endDateStr === date && endDateStr !== startDateStr) {
            const endMinNextDay =
              endDt.getHours() * 60 + endDt.getMinutes();
            occupied.push({
              start: 0,
              end: endMinNextDay,
              title: movie.title,
              time: s.time,
              date: endDateStr,
            });
          }
        }
      }
    }

    res.json(occupied);
  } catch (err) {
    console.error("Error al obtener horarios ocupados:", err);
    res.status(500).json({ message: "Error al obtener horarios ocupados" });
  }
};