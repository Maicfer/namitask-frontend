import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="flex items-center px-6 py-4 bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div
        className="flex items-center cursor-pointer"
        onClick={() => navigate("/dashboard")}
      >
        <img
          src="/logo-temporal.png" // Reemplaza con la ruta correcta de tu logo
          alt="Logo"
          className="h-8 w-8 mr-2"
        />
        <span className="text-xl font-semibold text-indigo-700">NamiTask</span>
      </div>
    </nav>
  );
};

export default Navbar;

