import './App.css';
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
  );
}

export default App;
