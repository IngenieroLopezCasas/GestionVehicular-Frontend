
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const usuario = localStorage.getItem("usuario");

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
