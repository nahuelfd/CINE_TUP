
import { useState } from 'react';
import './App.css'
import Movie from './components/movie/Movie';
import AddMovie from './components/movie/AddMovie';

function App() {
  const [movies, setMovies] = useState([]);

  const handleMovieAdded = (newMovie) => {
    setMovies([...movies, newMovie]);
  };

  return (
    <div className="container">
      <h1>CINE TUP</h1>
      <AddMovie onMovieAdded={handleMovieAdded} />
      <Movie movies={movies} />
    </div>
  );
}

export default App
