import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element, isAllowed }) => {
  return isAllowed ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
