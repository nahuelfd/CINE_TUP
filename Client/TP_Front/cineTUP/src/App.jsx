<<<<<<< HEAD
import './App.css';
import Dashboard from './components/library/dashboard/Dashboard';
import Login from './components/auth/login/Login';
import MovieTickets from './components/library/movieTickets/MovieTickets';
import { BrowserRouter, Routes, Route } from 'react-router';
import NavBar from './components/navBar/NavBar';
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <div className='app-container'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/peliculas" element={<Dashboard />} />
          <Route path="/peliculas/:id" element={<MovieTickets />} />
        </Routes>
      </div>
    </BrowserRouter>
=======

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
>>>>>>> feature-mateo
  );
}

export default App;
