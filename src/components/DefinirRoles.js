// src/components/DefinirRoles.jsx
import React, { useState, useEffect } from "react";
import api from "../services/api"; // Axios configurado

const rolesDisponibles = [
  { value: "administrador", label: "Administrador" },
  { value: "vigilante", label: "Vigilante" },
  { value: "usuario", label: "Usuario" }
];

const DefinirRoles = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [rolSeleccionado, setRolSeleccionado] = useState("");

  // Cargar usuarios al montar componente
  useEffect(() => {
    api.get("/usuarios")
      .then(res => setUsuarios(res.data))
      .catch(err => {
        console.error("Error cargando usuarios", err);
        alert("Error al cargar usuarios");
      });
  }, []);

  // Filtrar usuarios por nombre o username
  const usuariosFiltrados = usuarios.filter(u =>
    u.Nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    u.UserName.toLowerCase().includes(filtro.toLowerCase())
  );

  const handleAsignarRol = async () => {
    if (!usuarioSeleccionado || !rolSeleccionado) {
      alert("Debe seleccionar usuario y rol");
      return;
    }

    try {
      const res = await api.post(`/agregar/roles/${usuarioSeleccionado.IdUsuario}`, {
        rol: rolSeleccionado,
        status: 1
      });

      alert("Rol asignado correctamente");
      setUsuarioSeleccionado(null);
      setRolSeleccionado("");
      setFiltro("");
    } catch (error) {
      console.error("Error asignando rol", error);
      alert("Error al asignar rol");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <h2>Asignar Rol a Usuario</h2>
      <input
        type="text"
        placeholder="Buscar usuario por nombre o usuario..."
        value={filtro}
        onChange={e => setFiltro(e.target.value)}
        style={{ width: "100%", padding: "8px", marginBottom: "12px" }}
      />

      {filtro && (
        <ul style={{ maxHeight: 200, overflowY: "auto", border: "1px solid #ccc", padding: 0 }}>
          {usuariosFiltrados.map(u => (
            <li
              key={u.IdUsuario}
              onClick={() => setUsuarioSeleccionado(u)}
              style={{
                listStyle: "none",
                padding: "8px",
                cursor: "pointer",
                backgroundColor: usuarioSeleccionado?.IdUsuario === u.IdUsuario ? "#d0e7ff" : "white"
              }}
            >
              {u.Nombre} ({u.UserName})
            </li>
          ))}
          {usuariosFiltrados.length === 0 && <li style={{ padding: 8 }}>No hay usuarios que coincidan</li>}
        </ul>
      )}

      {usuarioSeleccionado && (
        <div style={{ marginTop: 20 }}>
          <p><b>Usuario seleccionado:</b> {usuarioSeleccionado.Nombre} ({usuarioSeleccionado.UserName})</p>

          <select
            value={rolSeleccionado}
            onChange={e => setRolSeleccionado(e.target.value)}
            style={{ width: "100%", padding: "8px", marginBottom: "12px" }}
          >
            <option value="">-- Seleccione un rol --</option>
            {rolesDisponibles.map(r => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>

          <button onClick={handleAsignarRol} style={{ padding: "10px 20px" }}>
            Asignar Rol
          </button>
        </div>
      )}
    </div>
  );
};

export default DefinirRoles;
