import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";


 const ProtectedRoute = ({ children, allowedRoles }) => {
  const { role = "", token } = useContext(AuthContext);


  if (!token) {
    return <Navigate to="/login" replace />;
  }


  if (!allowedRoles.includes(role)) {
    return <Navigate to="/403" replace />;
  }


  return children;
};

export default ProtectedRoute;
