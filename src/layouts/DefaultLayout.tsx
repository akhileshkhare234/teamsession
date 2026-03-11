import { Navigate, Outlet, useLocation } from "react-router-dom";
import React from "react";

const DefaultLayout = () => {
  const location = useLocation();

  const isLoggedIn =
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("accessToken");

  console.log("isLoggedIn", isLoggedIn);
  if (
    isLoggedIn &&
    location.pathname === "/login"
  ) {
    return <Navigate to="/admin/dashboard" replace={true} />;
  } else {
    return (
      <div className="layout">
        <Outlet />
      </div>
    );
  }
};

export default DefaultLayout;
