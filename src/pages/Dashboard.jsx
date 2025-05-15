import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../../index.css"; // Importa los estilos generales para el fondo

const Dashboard = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-dashboard-pattern bg-cover bg-center bg-fixed pt-16 p-8">
      <div className="max-w-xl mx-auto bg-white rounded-xl p-6 shadow-lg text-center space-y-4">
        <h1 className="text-2xl font-bold text-indigo-700">
          Bienvenido, {user?.nombre_completo || "Usuario"}
        </h1>
        <p className="text-gray-600">Correo: {user?.email}</p>

        <div className="mt-4">
          <button
            onClick={() => navigate("/profile")}
            className="button-primary"
          >
            Mi Perfil
          </button>
        </div>

        <div className="mt-6">
          <button
            onClick={logoutUser}
            className="button-secondary"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;