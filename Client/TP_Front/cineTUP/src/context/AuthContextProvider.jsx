import { useState } from "react"
import { AuthContext } from "./AuthContext";
import { jwtDecode } from "jwt-decode";



const AuthContextProvider = ({ children }) => {
    const tokenValue = localStorage.getItem('cine-tup-token');
    const [token, setToken] = useState(() => localStorage.getItem('cine-tup-token'));
    const [role, setRole] = useState(() => {
        if (tokenValue) {
            try {
                const decoded = jwtDecode(tokenValue);
                return decoded.role;
            } catch (error) {
                console.error("Error al decodificar token almacenado:", error);
                localStorage.removeItem('cine-tup-token');
            }
            
        }
        return null;
    });

    const handleLogin = (token) => {
        setToken(token);
        localStorage.setItem('cine-tup-token', token)

        try {
            const decoded = jwtDecode(token);
            setRole(decoded.role);
        } catch (error) {
            console.error("Error al decodificar token durante el login:", error);
            setRole(null);
        }        
    }

    const handleLogout = () => {
        setToken(null);
        setRole(null);
        localStorage.removeItem('cine-tup-token');
    }


    return (
        <AuthContext.Provider
            value={{
                token,
                role,
                onLogin: handleLogin,
                onLogout: handleLogout
            }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider