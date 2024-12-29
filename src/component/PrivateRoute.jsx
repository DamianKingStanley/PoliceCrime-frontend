import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const PrivateRoute = ({ element: Element, roles }) => {
  const { user } = useAuth();

  if (!user) {
    // Redirect to login page if user is not authenticated
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(user.role)) {
    // Redirect to home page if user does not have the required role
    return <Navigate to="/" />;
  }

  // Render the component if authenticated and authorized
  return <Element />;
};

export default PrivateRoute;
