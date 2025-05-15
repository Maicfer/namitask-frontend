import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import logo from "../../public/logo-temporal.png"; // Importa un logo temporal

const Dashboard = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-16 p-8 bg-gray-100">
      {/* Logo y botón de cerrar sesión en la parte superior */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <img src={logo} alt="Logo NamiTask" className="h-10 w-auto mr-4" />
          <h1 className="text-xl font-semibold text-indigo-700">NamiTask</h1>
        </div>
        <button
          onClick={logoutUser}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
        >
          Cerrar sesión
        </button>
      </div>

      {/* Bienvenida y menú principal */}
      <div className="max-w-xl mx-auto bg-white rounded-xl p-6 shadow-lg text-center space-y-4">
        <h2 className="text-2xl font-bold text-indigo-700">
          Bienvenido, {user?.nombre_completo || "Usuario"}
        </h2>
        <p className="text-gray-600">Correo: {user?.email}</p>

        <div className="flex justify-center gap-4 mt-4">
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
          {/* El botón de cerrar sesión ya está arriba */}
        </div>

        {/* Opciones que estaban en la parte superior */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={() => navigate("/crear-tarea")}
            className="button-secondary"
          >
            Crear tarea
          </button>
          <button
            onClick={() => navigate("/etiquetas")}
            className="button-secondary"
          >
            Etiquetas
          </button>
          {/* Inicio podría estar implícito en el logo o en "Ir al Tablero" */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;