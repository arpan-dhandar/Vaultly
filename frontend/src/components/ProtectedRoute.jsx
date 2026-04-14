import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Check if user is logged in
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user || !user.token) {
    // Redirect to login if no token found
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default ProtectedRoute;