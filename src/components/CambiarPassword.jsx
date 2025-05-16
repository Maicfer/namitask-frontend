import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom"; // Importamos Link

const CambiarPassword = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    old_password: "",
    new_password: "",
  });

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    try {
      const response = await axios.put(
        "https://namitask.onrender.com/api/profile/cambiar-clave/",
        form,
        {
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
          },
        }
      );

      setMensaje(response.data.success || "Contraseña cambiada exitosamente.");
      logoutUser();
      navigate("/login");
    } catch (err) {
      console.error("Error:", err);
      setError(err.response?.data?.error || "Error al cambiar contraseña.");
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-center text-indigo-700">
          Cambiar Contraseña
        </h2>

        {mensaje && <p className="text-green-600 mb-2">{mensaje}</p>}
        {error && <p className="text-red-600 mb-2">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            name="old_password"
            placeholder="Contraseña actual"
            value={form.old_password}
            onChange={handleChange}
            required
            className="form-control"
          />

          <input
            type="password"
            name="new_password"
            placeholder="Nueva contraseña"
            value={form.new_password}
            onChange={handleChange}
            required
            className="form-control"
          />

          <div className="flex justify-center gap-4 mt-4">
            <button
              type="submit"
              className="button-primary" // Usando el estilo del botón primario
            >
              Cambiar contraseña
            </button>
            <Link to="/profile" className="button-secondary"> {/* Usando el estilo del botón secundario */}
              Ir al perfil
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CambiarPassword;