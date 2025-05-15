import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../index.css";

const Dashboard = () => {
  const { logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen h-full pt-16 p-8">
      <div className="max-w-xl mx-auto bg-white rounded-xl p-6 shadow-lg text-center space-y-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-indigo-700">
            Bienvenido, {user?.nombre_completo || "Usuario"}
          </h1>
          <p className="text-gray-600">{user?.email}</p>
        </div>
      </div>
      {/* Los botones ahora están fuera del contenedor blanco */}
      <div className="max-w-xl mx-auto mt-8 flex justify-center gap-4 flex-wrap">
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
  );
};

export default Dashboard;