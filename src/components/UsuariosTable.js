import React, { useEffect, useState } from "react";
import api from "../services/api";

const roles = ["ADMINISTRADOR", "OBSERVADOR", "EDITOR"];

const UsuariosTable = () => {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    api.get("/usuarios")
      .then((res) => setUsuarios(res.data))
      .catch((err) => console.error("Error al cargar usuarios", err));
  }, []);

  const handleChangeRol = (id, nuevoRol) => {
    api.put(`/usuarios/${id}/rol`, { rol: nuevoRol })
      .then(() => {
        const nuevosUsuarios = usuarios.map((u) =>
          u.id === id ? { ...u, rol: nuevoRol } : u
        );
        setUsuarios(nuevosUsuarios);
      })
      .catch((err) => alert("Error al cambiar el rol"));
  };

  return (
    <div className="tabla-container">
      <h2>Gestión de Privilegios</h2>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Cambiar Rol</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.nombre}</td>
              <td>{usuario.correo}</td>
              <td>{usuario.rol}</td>
              <td>
                <select
                  value={usuario.rol}
                  onChange={(e) => handleChangeRol(usuario.id, e.target.value)}
                >
                  {roles.map((rol) => (
                    <option key={rol} value={rol}>
                      {rol}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsuariosTable;
