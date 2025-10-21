import { useState } from "react"
import ReleasesList from "./ReleasesList"
import { MOVIES } from "../../data/data"

const Releases = () => {
    const [movies, setMovies] = useState(MOVIES)
  return (
    <div>
      <h1 className="title-page text-start mt-4 mb-4 fw-bold text-light">PRÓXIMOS ESTRENOS</h1>
      <ReleasesList movies={movies}/>
    </div>
  )
}

export default Releases