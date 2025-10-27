import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import { ThemeProvider } from './context/ThemeContext.jsx';
import AuthContextProvider from "./context/AuthContextProvider.jsx"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AuthContextProvider>  
        <App />
      </AuthContextProvider>
    </ThemeProvider>
  </StrictMode>,
);
