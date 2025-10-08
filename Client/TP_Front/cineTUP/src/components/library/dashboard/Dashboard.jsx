import MovieList from "../movieList/MovieList"
import NewMovie from "../newMovie/NewMovie"

const Dashboard = () => {
    console.log("dashboard is ok")
  return (
    <div>
      <h1 className="text-center mt-4 mb-4">PELICULAS EN CARTELERA</h1>
      <NewMovie />
      <MovieList />
    </div>
  )
}

export default Dashboard