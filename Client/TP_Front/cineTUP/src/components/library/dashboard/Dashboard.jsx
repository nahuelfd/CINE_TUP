import MovieList from "../movieList/MovieList";
import { useState, useEffect } from "react";
import AddMovie from "../../movie/AddMovie";
import { jwtDecode } from "jwt-decode";

const Dashboard = () => {
  const [movies, setMovies] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

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

    // Verificar rol del usuario
    const token = localStorage.getItem("cine-tup-token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const role = decoded.role; 
        setIsAdmin(role === "admin" || role === "sysadmin");
      } catch (err) {
        console.error("Error decodificando token:", err);
        setIsAdmin(false);
      }
    }
  }, []);

  const handleMovieAdded = async () => {
    await fetchMovies();
  };

  const handleMovieDeleted = async () => {
    await fetchMovies();
  };

  return (
    <div className="dashboard-page">
      {isAdmin && <AddMovie onMovieAdded={handleMovieAdded} />}

      <h1 className="fw-bold text-center mt-4">PELÍCULAS EN CARTELERA</h1>
      <MovieList movies={movies} onMovieDeleted={handleMovieDeleted} isAdmin={isAdmin}/>
    </div>
  );
};

export default Dashboard;
