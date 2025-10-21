import MovieList from "../library/movieList/MovieList";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { MOVIES } from '../../data/data'

const Home = () => {
  return (
    <div>
      {/* Carrusel anuncios*/}
      <section className="bg-dark">
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

      {/* Seccion peliculas en cartelera*/}
      <section style={{ backgroundColor: "#f5f5f5", padding: "2rem 0" }}>
        <h2 className="text-center fw-bold mb-4">EN CARTELERA</h2>
        <MovieList movies={ MOVIES } />
      </section>

      {/* Seccion proximos estrenos
      <section style={{ backgroundColor: "#fff", padding: "2rem 0" }}>
        <h2 className="text-center fw-bold mb-5">PROXIMOS ESTRENOS</h2>
        <div className="container d-flex flex-column gap-4">
          {upcomingReleases.map((movie, index) => (
            <div
              key={index}
              className="d-flex flex-column flex-md-row align-items-center bg-light rounded-4 shadow-sm overflow-hidden"
            >
              <img
                src={movie.img}
                alt={movie.title}
                className="w-100 w-md-25"
                style={{ maxWidth: "300px", height: "auto", objectFit: "cover" }}
              />
              <div className="p-4">
                <h3 className="fw-bold">{movie.title}</h3>
                <p className="text-muted mb-1">{movie.releaseDate}</p>
                <p>{movie.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      */}
    </div>
  );
};

export default Home;
