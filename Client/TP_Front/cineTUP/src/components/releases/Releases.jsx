import { useEffect, useState } from "react";
import ReleasesList from "./ReleasesList";
import { jwtDecode } from "jwt-decode";

const Releases = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchMovies = async () => {
    try {
      const token = localStorage.getItem("cine-tup-token");
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch("http://localhost:3000/movies", { headers });
      if (!response.ok) throw new Error(`Error al obtener películas: ${response.status}`);
      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();

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

  const handleMovieDeleted = async () => {
    await fetchMovies();
  };

  if (loading) return <p className="text-center mt-4">Cargando estrenos...</p>;

  return (
    <div>
      <h1 className="fw-bold text-center mt-4">PRÓXIMOS ESTRENOS</h1>
      <ReleasesList movies={movies} onMovieDeleted={handleMovieDeleted} isAdmin={isAdmin} />
    </div>
  );
};

export default Releases;
