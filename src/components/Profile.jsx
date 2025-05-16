import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom"; // Importamos Link
import api from "../services/api"; // ✅ Usa axios con baseURL

const Profile = () => {
  const { authTokens, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const [form, setForm] = useState({
    nombre_completo: "",
    celular: "",
    ciudad: "",
    pais: "",
    genero: "",
  });
  const [foto, setFoto] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authTokens) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await api.get("/api/profile/", {
          headers: { Authorization: `Bearer ${authTokens.access}` },
        });
        setPerfil(response.data);
        setForm({
          nombre_completo: response.data.nombre_completo || "",
          celular: response.data.celular || "",
          ciudad: response.data.ciudad || "",
          pais: response.data.pais || "",
          genero: response.data.genero || "",
        });
        setFotoPreview(response.data.foto || null);
      } catch (error) {
        console.error("Error al cargar el perfil:", error);
      }
    };

    fetchProfile();
  }, [authTokens, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    setFoto(file);
    setFotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (foto) formData.append("foto", foto);

    try {
      setLoading(true);
      await api.put("/profile/", formData, {
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Perfil actualizado correctamente.");
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      alert("Hubo un problema al actualizar el perfil.");
    } finally {
      setLoading(false);
    }
  };

  if (!perfil) return <div className="text-center mt-5">Cargando perfil...</div>;

  return (
    <div className="container mt-5 pt-4">
      <div className="card p-4 shadow-lg mx-auto" style={{ maxWidth: "600px" }}>
        <h2 className="text-center text-primary mb-4">Mi Perfil</h2>

        {fotoPreview && (
          <div className="text-center mb-3">
            <img
              src={fotoPreview.startsWith("http") ? fotoPreview : `https://namitask.onrender.com/api/profile/${fotoPreview}`}
              alt="Foto de perfil"
              className="rounded-circle object-fit-cover"
              style={{ width: "120px", height: "120px" }}
            />
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Nombre completo</label>
            <input
              type="text"
              name="nombre_completo"
              className="form-control"
              value={form.nombre_completo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label>Celular</label>
            <input
              type="text"
              name="celular"
              className="form-control"
              value={form.celular}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label>Ciudad</label>
            <input
              type="text"
              name="ciudad"
              className="form-control"
              value={form.ciudad}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label>País</label>
            <input
              type="text"
              name="pais"
              className="form-control"
              value={form.pais}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label>Género</label>
            <select
              name="genero"
              className="form-control"
              value={form.genero}
              onChange={handleChange}
            >
              <option value="">Selecciona una opción</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
              <option value="O">Otro</option>
            </select>
          </div>

          <div className="mb-3">
            <label>Foto de perfil</label>
            <input type="file" className="form-control" onChange={handleFotoChange} />
          </div>

          <div className="d-flex justify-content-between mt-4">
            <button type="submit" className="btn btn-success" disabled={loading}>
              {loading ? "Guardando..." : "Guardar cambios"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/dashboard")}
            >
              Volver
            </button>
          </div>

          {/* Botón para cambiar la contraseña */}
          <div className="mt-3 text-center">
            <Link to="/cambiar-password" className="btn btn-info">
              Cambiar contraseña
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;