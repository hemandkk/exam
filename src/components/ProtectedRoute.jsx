import { Navigate } from "react-router-dom";
const ProtectedRoute = ({ children }) => {
 const user = localStorage.getItem("user_id"); // or any auth logic you use
  //const token = localStorage.getItem("access_token");

  if (!user_id) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
