import './App.css';
import Dashboard from './components/library/dashboard/Dashboard';
import Login from './components/auth/login/Login';
import MovieTickets from './components/library/movieTickets/MovieTickets';
import { BrowserRouter, Routes, Route } from 'react-router';
import NavBar from './components/navBar/NavBar';
import Home from './components/home/Home'
import Releases from './components/releases/Releases';
import Register from './components/auth/register/Register';
import Movie from "./components/movie/Movie"

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <div className='app-container'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/peliculas" element={<Dashboard />} />
          <Route path="/estrenos" element={<Releases />} />
          <Route path="/peliculas/:id" element={<MovieTickets />} />
          <Route path="/movie" element={<Movie />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
