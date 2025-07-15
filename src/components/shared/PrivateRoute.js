// src/components/PrivateRoute.js
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { UserContext } from './UserContext';

const PrivateRoute = ({ allowedRoles }) => {
  // const user = localStorage.getItem('user');
  const { userProfile } = useContext(UserContext);

  console.log("User Profile:", userProfile);
  // Check if userProfile exists and has the required role
  if (!userProfile) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(userProfile.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return userProfile ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
