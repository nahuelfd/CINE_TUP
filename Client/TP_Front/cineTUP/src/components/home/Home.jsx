import MovieList from "../library/movieList/MovieList";
import ReleasesList from "../releases/ReleasesList";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { MOVIES } from '../../data/data'

const Home = () => {
  
  const upcomingMovies = MOVIES.filter(movie => !movie.isAvailable);
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
            {MOVIES.map((movie) => (
              <div key={movie.id}>
                <img
                  src={movie.imageBanner}
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
        <MovieList movies={ MOVIES } />
      </section>

      {/* Seccion proximos estrenos */}
      <section style={{ backgroundColor: "var(--card-bg)", padding: "2rem 0" }}>
        <h2 className="text-center fw-bold mb-4">PRÓXIMOS ESTRENOS</h2>
        <ReleasesList movies={MOVIES} />
      </section>
    </div>
  );
};

export default Home;
