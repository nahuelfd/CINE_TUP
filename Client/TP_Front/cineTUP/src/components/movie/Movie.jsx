import { useEffect, useState } from "react";
import axios from "axios";
import AddMovie from "./AddMovie";
import './movie.css';

const Movie = () => {
  const [movies, setMovies] = useState([]);


  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get("http://localhost:3000/movies");
        setMovies(response.data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };
    fetchMovies();
  }, []);


  const handleMovieAdded = (newMovie) => {
    setMovies((prev) => [...prev, newMovie]);
  };

  return (
    <div>
      <h1>Películas</h1>
      <AddMovie onMovieAdded={handleMovieAdded} />
      <table>
        <thead>
          <tr>
            <th>Título</th>
            <th>Director</th>
            <th>Género</th>
            <th>Duración</th>
            <th>Idioma</th>
            <th>Disponible</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((m) => (
            <tr key={m.id}>
              <td>{m.title}</td>
              <td>{m.director}</td>
              <td>{m.category}</td>
              <td>{m.duration}</td>
              <td>{m.language}</td>
              <td>{m.isAvailable ? "Sí" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Movie;