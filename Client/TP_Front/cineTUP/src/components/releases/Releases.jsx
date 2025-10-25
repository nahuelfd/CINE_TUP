import { useState } from "react"
import ReleasesList from "./ReleasesList"
import { MOVIES } from "../../data/data"

const Releases = () => {
    const [movies, setMovies] = useState(MOVIES)
  return (
    <div>
      <h1 className="fw-bold text-center mt-4">PRÓXIMOS ESTRENOS</h1>
      <ReleasesList movies={movies}/>
    </div>
  )
}

export default Releases