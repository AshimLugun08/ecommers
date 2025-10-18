import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    // If the user is not logged in, redirect them to the login page
    return <Navigate to='/auth' replace />;
  }

  // If the user is logged in, show the page they wanted to see
  return children;
};

export default ProtectedRoute;
