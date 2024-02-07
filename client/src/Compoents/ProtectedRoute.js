import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const navigate = useNavigate();
  useEffect(() => {
    const role = sessionStorage.getItem("role");
    const token = sessionStorage.getItem("token");

    if (!token) {
      navigate("/");
    } else if (!role || !allowedRoles.includes(role)) {
      navigate("/");
    }
  }, [allowedRoles, navigate]);
  return children;
};

export default ProtectedRoute;
