import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  
  // User must have both user data and token to be authenticated
  if (!user || !token) {
    // Clear any partial auth data
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;