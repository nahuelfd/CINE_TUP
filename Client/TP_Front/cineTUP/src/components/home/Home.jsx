
import MovieList from "../library/movieList/MovieList";
import ReleasesList from "../releases/ReleasesList";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useEffect, useState } from "react";

const Home = () => {
  const [movies, setMovies] = useState([]);

  const fetchMovies = async () => {
    try {
      const response = await fetch("http://localhost:3000/movies");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Películas recibidas:", data);
      setMovies(data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  useEffect(() =>{
    fetchMovies();
  }, []);

  const upcomingMovies = movies.filter(movie => !movie.isAvailable);
  return (
    
    <div>
      {/* Carrusel anuncios*/}
      <section className="">
        <div className="max-w-6xl mx-auto rounded-3 overflow-hidden">
          <Carousel
            autoPlay
            infiniteLoop
            showStatus={false}
            showThumbs={false}
            interval={4000}
          >
            {movies.map((movie) => (
              <div key={movie.id}>
                <img
                  src={movie.bannerUrl}
                  alt={movie.title}
                  className="w-100"
                  style={{ height: "400px", objectFit: "cover" }}
                />
              </div>
            ))}
          </Carousel>
        </div>
      </section>

      {/* Seccion peliculas en cartelera */}
      <section style={{padding: "2rem 0" }}>
        <h2 className="text-center fw-bold mb-5">EN CARTELERA</h2>
        <MovieList movies={ movies } />
      </section>

      {/* Seccion proximos estrenos */}
      <section style={{ backgroundColor: "var(--card-bg)", padding: "2rem 0" }}>
        <h2 className="text-center fw-bold mb-4">PRÓXIMOS ESTRENOS</h2>
        <ReleasesList movies={movies} />
      </section>
    </div>
  );
};

export default Home;
