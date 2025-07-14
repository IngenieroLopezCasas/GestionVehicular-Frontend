import React, { useState } from "react";
import api from "../services/api"; // Asegúrese de tener configurado Axios
import { useNavigate } from "react-router-dom";

const RegistrarMarca = () => {
  const [nombre, setNombre] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post("/marca", { nombre })
      .then(() => {
        alert("Marca registrada exitosamente");
        navigate("/");
      })
      .catch((error) => {
        console.error("Error al registrar marca:", error);
        alert("Error al registrar la marca");
      });
  };

  return (
    <div className="container">
      <h2>Registrar Marca</h2>
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label>Nombre de la marca:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <button type="submit" className="submit-button">Registrar</button>
      </form>
    </div>
  );
};

export default RegistrarMarca;
