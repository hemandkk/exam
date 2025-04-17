import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const userType = localStorage.getItem("user_type");

  if (userType !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminRoute;
