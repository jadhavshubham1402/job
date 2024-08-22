// src/components/Navbar.js
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { logout } from "../redux/reducer/reducer";
import { useDispatch } from "react-redux";
import { formatHeader } from "../helper/function";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };


  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-xl font-bold">
          {formatHeader(location.pathname.split("/")[2])}
        </h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
