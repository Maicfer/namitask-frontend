import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // Importa el contexto de autenticación

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // Obtén la información del usuario del contexto

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
      {user && (
        <div className="user-info">
          <span className="welcome-text">Bienvenido, {user.nombre_completo || "Usuario"}</span>
          <span className="email-text">{user.email}</span>
        </div>
      )}
    </nav>
  );
};

export default Navbar;