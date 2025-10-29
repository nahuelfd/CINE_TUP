import './App.css';
import Dashboard from './components/library/dashboard/Dashboard';
import Login from './components/auth/login/Login';
import MovieTickets from './components/library/movieTickets/MovieTickets';
import { BrowserRouter, Routes, Route } from 'react-router';
import NavBar from './components/navBar/NavBar';
import Home from './components/home/Home'
import Releases from './components/releases/Releases';
import Register from './components/auth/register/Register';
import EditProfile from "./components/profile/EditProfile";
import ProtectedRoute from "./components/protectedRoutes/ProtectedRoute";
import Forbidden from "./components/error/Forbidden";
import SysadminPanel from './components/protectedRoutes/SysadminPanel';
import ErrorNotFound from './components/error/ErrorNotFound';
import EditMovieForm from './components/editMovie/EditMovieForm';
import EditMovieList from './components/editMovie/EditMovieList';

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route path="/peliculas" element={<Dashboard />} />
          <Route path="/estrenos" element={<Releases />} />

          <Route
            path="/editar"
            element={
              <ProtectedRoute allowedRoles={["admin", "sysadmin"]}>
                <EditMovieList />
              </ProtectedRoute>
            } />

          <Route
            path="/editar/:id"
            element={
              <ProtectedRoute allowedRoles={["admin", "sysadmin"]}>
                <EditMovieForm />
              </ProtectedRoute>
            } />

            
          <Route
            path="/peliculas/:id"
            element={
              <ProtectedRoute allowedRoles={["user", "admin", "sysadmin"]}>
                <MovieTickets />
              </ProtectedRoute>
            }
          />

          <Route
            path="/sysadminPanel"
            element={
              <ProtectedRoute allowedRoles={["sysadmin"]}>
                <SysadminPanel />
              </ProtectedRoute>
            }
          />

          <Route path="/403" element={<Forbidden />} />
          <Route path="*" element={<ErrorNotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
