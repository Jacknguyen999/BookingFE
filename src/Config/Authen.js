import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import ApiService from "./ApiService";

export const CustomerRoute = ({ element }) => {
  const location = useLocation();

  if (!ApiService.isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return element;
};

export const AdminRoute = ({ element }) => {
  const location = useLocation();

  if (!ApiService.isAdmin()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return element;
};
