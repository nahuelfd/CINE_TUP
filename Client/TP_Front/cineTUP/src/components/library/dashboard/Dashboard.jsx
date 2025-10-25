import MovieList from "../movieList/MovieList"
import { MOVIES } from "../../../data/data"
import { useState } from "react"

const Dashboard = () => {
  const [movies, setMovies] = useState(MOVIES)
  return (
    <div className="dashboard-page">
      <h1 className="fw-bold text-center  mt-4">PELÍCULAS EN CARTELERA</h1>
      <MovieList movies={movies} />
    </div>
  )
}

export default Dashboard