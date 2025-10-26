import { useState } from "react";
import { AuthContext } from "./AuthContext";

const AuthContextProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('cinetup-token') || null);

  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem('cinetup-token', newToken);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('cinetup-token');
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        onLogin: handleLogin,
        onLogout: handleLogout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
