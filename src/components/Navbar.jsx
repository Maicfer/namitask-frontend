import React, { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Importa useLocation
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Obtén la ubicación actual
  const { user } = useContext(AuthContext);

  // No mostrar la información del usuario en la página de inicio de sesión ("/")
  const shouldShowUserInfo = user && location.pathname !== "/login";

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
      {shouldShowUserInfo && (
        <div className="user-info">
          <span className="welcome-text">Bienvenido, {user.nombre_completo || "Usuario"}</span>
          <span className="email-text">{user.email}</span>
        </div>
      )}
    </nav>
  );
};

export default Navbar;