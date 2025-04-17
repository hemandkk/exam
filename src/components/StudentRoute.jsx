// src/components/StudentRoute.js
import { Navigate } from "react-router-dom";

const StudentRoute = ({ children }) => {
  const userType = localStorage.getItem("user_type");

  if (userType === "admin") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default StudentRoute;
