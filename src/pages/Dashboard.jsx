import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../../index.css"; // Importa los estilos generales

const Dashboard = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="bg-dashboard-pattern bg-cover bg-center bg-fixed min-h-screen pt-16 p-8"> {/* Aplicamos el fondo aquí */}
      <div className="max-w-xl mx-auto bg-white rounded-xl p-6 shadow-lg text-center space-y-4">
        <div className="text-center"> {/* Contenedor para Bienvenido y Correo */}
          <h1 className="text-2xl font-bold text-indigo-700">
            Bienvenido, {user?.nombre_completo || "Usuario"}
          </h1>
          <p className="text-gray-600">{user?.email}</p>
        </div>

        <div className="flex justify-center gap-4 mt-4 flex-wrap">
          <button
            onClick={() => navigate("/profile")}
            className="button-primary"
          >
            Mi Perfil
          </button>
          <button
            onClick={() => navigate("/tablero")}
            className="button-primary"
          >
            Ir al Tablero
          </button>
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