import { useEffect, useState } from "react";
import ReleasesList from "./ReleasesList";

const Releases = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Función para obtener películas desde el backend
  const fetchMovies = async () => {
    try {
      const response = await fetch("http://localhost:3000/movies");
      if (!response.ok) {
        throw new Error(`Error al obtener películas: ${response.status}`);
      }
      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Llamada al cargar el componente
  useEffect(() => {
    fetchMovies();
  }, []);

  if (loading) return <p className="text-center mt-4">Cargando estrenos...</p>;

  return (
    <div>
      <h1 className="fw-bold text-center mt-4">PRÓXIMOS ESTRENOS</h1>
      <ReleasesList movies={movies} />
    </div>
  );
};

export default Releases;
