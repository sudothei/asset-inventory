import * as React from "react";
import { Navigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import Claims from "types/Claims";

const PrivateRoute = ({ component }: { component: JSX.Element }) => {
  const token = localStorage.getItem("token");

  if (token) {
    const decodedToken: Claims = jwt_decode(token);
    if (decodedToken) {
      if (Date.now() / 1000 < decodedToken.exp) {
        if (decodedToken.admin) {
          return component;
        }
      }
    }
  }
  localStorage.removeItem("token");
  return <Navigate to="/login" />;
};

export default PrivateRoute;
