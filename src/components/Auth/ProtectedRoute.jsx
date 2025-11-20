import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // 1. Retrieve the token from localStorage (or your state management)
  // We assume when a user logs in, you save: localStorage.setItem('token', 'xyz')
  const isAuthenticated = localStorage.getItem('token');

  // 2. If no token exists, kick them back to the login page
  // 'replace' prevents them from going back to the protected page using the browser Back button
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 3. If token exists, render the requested component (children)
  return children;
};

export default ProtectedRoute;