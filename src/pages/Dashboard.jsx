import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../index.css";

const Dashboard = () => {
  const { logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="bg-dashboard-pattern bg-cover bg-center bg-fixed min-h-screen h-full pt-16 p-8">
      <div className="max-w-xl mx-auto bg-white rounded-xl p-6 shadow-lg text-center space-y-4">
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