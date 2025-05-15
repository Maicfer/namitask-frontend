import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar-floating">
      <div
        className="logo-container"
        onClick={() => navigate("/dashboard")}
      >
        <img
          src="/logo-temporal.png"
          alt="Logo"
          className="logo"
        />
        <span className="logo-text">NamiTask</span>
      </div>
    </nav>
  );
};

export default Navbar;