import { useState } from "react"
import { AuthContext } from "./AuthContext";

const tokenValue = localStorage.getItem('cine - token');

const AuthContextProvider = ({ children }) => {
    const [token, setToken] = useState(tokenValue);

    const handleLogin = (token) => {
        setToken(token);
        localStorage.setItem('cinetup-token', token)
    }

    const handleLogout = () => {
        setToken(null);
        localStorage.removeItem('cinetup-token');
    }


    return (
        <AuthContext
            value={{
                token,
                onLogin: handleLogin,
                onLogout: handleLogout
            }}>
            {children}
        </AuthContext>
    )
}

export default AuthContextProvider