import { useState } from "react"
import { AuthContext } from "./AuthContext";



const AuthContextProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem('cinetup-token'));

    const handleLogin = (token) => {
        setToken(token);
        localStorage.setItem('cinetup-token', token)
    }

    const handleLogout = () => {
        setToken(null);
        localStorage.removeItem('cinetup-token');
    }


    return (
        <AuthContext.Provider
            value={{
                token,
                onLogin: handleLogin,
                onLogout: handleLogout
            }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider