import { useParams } from "react-router";
import { MOVIES } from "../../../data/data";

const MovieTickets = () => {
  const { id } = useParams();
  const movie = MOVIES.find(m => m.id === parseInt(id));

  if (!movie) {
    return <p className="text-center mt-4">Película no encontrada.</p>;
  }

  return (
    <div className="container mt-4">
      <h1>{movie.title}</h1>
      <img src={movie.imageUrl} alt={movie.title} className="img-fluid mb-3" />
      <p><strong>Categoría:</strong> {movie.category}</p>
      <p><strong>Duración:</strong> {movie.duration} min</p>
      <p>{movie.isAvailable ? "" : "Proximos estrenos"}</p>
      <p>{movie.description}</p>
    </div>
  );
};

export default MovieTickets;