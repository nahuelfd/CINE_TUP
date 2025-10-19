import api from "./api";

export const getMovies = async () => {
  try {
    const res = await api.get("/movies");
    return res.data;
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const createMovie = async (movieData, token) => {
  try {
    const res = await api.post("/movies", movieData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};