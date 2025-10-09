import MovieList from "../components/library/movieList/MovieList";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const Home = () => {
  // Carrusel de anuncios
  const adImages = [
    "https://proxymedia.woopic.com/api/v1/images/331%2FINTERSTELLAW0089482_BAN1_2424_NEWTV_UHD.jpg",
    "https://images5.alphacoders.com/114/1144756.jpg",
    "https://wallpapers.com/images/hd/marlonbrando-poster-de-el-padrino-v288n2h2t3u85apc.jpg",
  ];

  // Proximos Estrenos
  const upcomingReleases = [
    {
      title: "Dune: Parte 2",
      releaseDate: "Noviembre 2025",
      description: "La continuación épica del viaje de Paul Atreides en Arrakis.",
      img: "https://posterspy.com/wp-content/uploads/2023/05/Dune-2-Poster-4x5-1.jpg",
    },
    {
      title: "Joker 2",
      releaseDate: "Diciembre 2025",
      description: "Arthur Fleck regresa en una historia aún más oscura.",
      img: "https://es.web.img3.acsta.net/img/e5/dc/e5dc6820bc894028db90f70bb8cd0057.jpg",
    },
  ];

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
            {adImages.map((src, index) => (
              <div key={index}>
                <img
                  src={src}
                  alt={`Advertisement ${index + 1}`}
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
        <MovieList maxMovies={5} />
      </section>

      {/* Seccion proximos estrenos*/}
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
    </div>
  );
};

export default Home;
