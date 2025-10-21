import MovieList from "../movieList/MovieList"
import { MOVIES } from "../../../data/data"
import { useState } from "react"

const Dashboard = () => {
  const [movies, setMovies] = useState(MOVIES)
  return (
    <div>
      <h1
        className="title-page text-start mt-4 mb-4 fw-bold text-light"
      >
        PELÍCULAS EN CARTELERA
      </h1>

      <MovieList movies={movies} />
    </div>
  )
}

export default Dashboard