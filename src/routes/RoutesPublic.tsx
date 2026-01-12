import React from "react";
import { useSession } from "../store/useSession";
import { Navigate, Outlet } from "react-router-dom";

const RoutesPublic = () => {
  const { isLoggedIn } = useSession();
  return isLoggedIn ? <Navigate to="/" replace /> : <Outlet />;
};

export default RoutesPublic;
