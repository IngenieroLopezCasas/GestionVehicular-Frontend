import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import Select from "react-select";  // Import react-select
import "./App.css";

const AsignarRol = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null); // Ahora es objeto opción
  const [formData, setFormData] = useState({
    rol: "",
    status: "1", // Por defecto activo
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await api.get("/usuarios");
        setUsuarios(response.data);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
    };

    fetchUsuarios();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAsignar = async (e) => {
    e.preventDefault();

    if (!usuarioSeleccionado || !formData.rol) {
      alert("Por favor, seleccione un usuario y un rol.");
      return;
    }

    try {
      await api.post(`/agregar/roles/${usuarioSeleccionado.value}`, {
        rol: formData.rol,
        status: parseInt(formData.status),
      });

      alert("✅ Rol asignado correctamente");
      navigate("/"); // Cambie esto a donde quiera redirigir
    } catch (error) {
      console.error("Error al asignar rol:", error);
      alert("❌ Error al asignar el rol.");
    }
  };

  // Mapear usuarios para react-select
  const opcionesUsuarios = usuarios.map((usuario) => ({
    value: usuario.IdUsuario,
    label: `${usuario.Nombre} ${usuario.ApellidoPat} ${usuario.ApellidoMat} (${usuario.UserName})`,
  }));

  return (
    <div className="asignar-rol-container">
      <h2>Asignar Rol a Usuario</h2>
      <form onSubmit={handleAsignar}>
        <label>Seleccione Usuario:</label>
        <Select
          options={opcionesUsuarios}
          value={usuarioSeleccionado}
          onChange={setUsuarioSeleccionado}
          placeholder="Buscar usuario..."
          isSearchable
          required
        />

        <label>Seleccione Rol:</label>
        <select
          name="rol"
          value={formData.rol}
          onChange={handleChange}
          required
        >
          <option value="">-- Seleccione un rol --</option>
          <option value="Administrador">Administrador</option>
          <option value="Vigilante">Vigilante</option>
        </select>

        <label>Status:</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
        >
          <option value="1">Activo</option>
          <option value="0">Inactivo</option>
        </select>

        <button type="submit">Asignar Rol</button>
      </form>
    </div>
  );
};

export default AsignarRol;
