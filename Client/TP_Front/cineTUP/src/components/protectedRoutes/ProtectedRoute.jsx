import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { role = "", token } = useContext(AuthContext); // 👈 valor por defecto

  // Si no hay token, redirige a login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si el rol no está en los permitidos, redirige a 403
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/403" replace />;
  }

  // Si todo ok, renderiza el componente protegido
  return children;
};

export default ProtectedRoute;


/* ProtecterRouter original, el de arriba es modificado porq no me funcionaba
 const ProtectedRoute = ({ children, allowedRoles }) => {
  const { role = "", token } = useContext(AuthContext);

  // Si no hay token, redirige a login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si el rol no está en los permitidos, redirige a 403
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/403" replace />;
  }

  // Si todo ok, renderiza el componente protegido
  return children;
};

export default ProtectedRoute; */

