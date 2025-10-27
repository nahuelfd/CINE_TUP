import { useEffect, useState } from "react";

const AllMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🟢 Obtener todas las películas
  const fetchMovies = async () => {
    try {
      const response = await fetch("http://localhost:3000/movies");
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔴 Eliminar una película por ID
  const deleteMovie = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta película definitivamente?")) return;

    try {
      const token = localStorage.getItem("cine-tup-token"); // si tu ruta DELETE requiere auth
      const response = await fetch(`http://localhost:3000/movies/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) throw new Error(`Error al eliminar la película: ${response.status}`);

      // 🧹 Actualiza la lista en el frontend
      setMovies(movies.filter((movie) => movie.id !== id));
      alert("Película eliminada con éxito.");
    } catch (error) {
      console.error("Error deleting movie:", error);
      alert("No se pudo eliminar la película.");
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  if (loading) return <p style={{ textAlign: "center" }}>Cargando películas...</p>;
  if (movies.length === 0) return <p style={{ textAlign: "center" }}>No hay películas cargadas.</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ textAlign: "center" }}>🎬 Listado de Películas</h1>
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "1.5rem",
        justifyContent: "center"
      }}>
        {movies.map((movie) => (
          <div
            key={movie.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "1rem",
              width: "260px",
              textAlign: "center",
              background: "#f8f9fa",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
            }}
          >
            <h3>{movie.id}</h3>
            <h3>{movie.title}</h3>
            <p><strong>Director:</strong> {movie.director}</p>
            <p><strong>Categoría:</strong> {movie.category || "N/A"}</p>
            {movie.bannerUrl ? (
              <img
                src={movie.bannerUrl}
                alt={movie.title}
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "8px"
                }}
              />
            ) : (
              <p style={{ color: "gray" }}>Sin banner</p>
            )}
            <button
              onClick={() => deleteMovie(movie.id)}
              style={{
                marginTop: "1rem",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                padding: "0.5rem 1rem",
                borderRadius: "5px",
                cursor: "pointer"
              }}
            >
              🗑️ Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllMovies;
