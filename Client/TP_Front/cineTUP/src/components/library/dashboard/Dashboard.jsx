import { useState } from "react"
import MovieList from "../movieList/MovieList"
import NewMovie from "../newMovie/NewMovie"
import { MOVIES } from "../../../data/data"

const Dashboard = () => {
  const [movies, setMovies] = useState(MOVIES)

  {const handleAddMovie = (newMovie) => {
    setMovies([...movies, { id: movies.length + 1, ...newMovie}]);
  }}
  return (
    <div>
      <h1 className="text-center mt-4 mb-4">PELICULAS EN CARTELERA</h1>
      {/*<NewMovie onAddMovie={handleAddMovie}/> Agregar peliculas solo para admins*/}
      <MovieList movies={movies}/>
    </div>
  )
}

export default Dashboard