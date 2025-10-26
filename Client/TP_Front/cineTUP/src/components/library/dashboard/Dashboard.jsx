import MovieList from "../movieList/MovieList";
import { useState, useEffect } from "react";
import AddMovie from "../../movie/AddMovie";

const Dashboard = () => {
  const [movies, setMovies] = useState([]);

  const fetchMovies = async () => {
    try {
      const token = localStorage.getItem("cine-tup-token");
      const headers = { "Content-Type": "application/json" };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch("http://localhost:3000/movies", {
        method: "GET",
        headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleMovieAdded = async () => {
    await fetchMovies();
  };

  const handleMovieDeleted = async () => {
    await fetchMovies();
  };

  const isLoggedIn = !!localStorage.getItem("cine-tup-token");

  return (
    <div className="dashboard-page">
      {isLoggedIn && <AddMovie onMovieAdded={handleMovieAdded} />}

      <h1 className="fw-bold text-center mt-4">PELÍCULAS EN CARTELERA</h1>
      <MovieList movies={movies} onMovieDeleted={handleMovieDeleted}/>
    </div>
  );
};

export default Dashboard;
