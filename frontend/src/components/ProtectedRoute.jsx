import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const { authUser } = useSelector((store) => store.user);

  // Redirect to login if the user is not authenticated
  return authUser ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
