import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";

const EditVehicle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState({
    marca: "", modelo: "", placas: "", color: "", serie: "", unidad: "",
    transmision: "", iddepartamento: "", submarca: "", estatus: "", km: 0,
  });

  useEffect(() => {
    api.get("/vehicles")
      .then((res) => {
        const vehiculo = res.data.find(v => v.IdVehiculos === parseInt(id));
        if (vehiculo) {
          setVehicle({
            marca: vehiculo.Marca,
            modelo: vehiculo.Modelo,
            placas: vehiculo.Placas,
            color: vehiculo.Color,
            serie: vehiculo.Serie,
            unidad: vehiculo.Unidad,
            transmision: vehiculo.Transmision,
            iddepartamento: vehiculo.IdDepartamento,
            submarca: vehiculo.Submarca,
            estatus: vehiculo.Estatus,
            km: vehiculo.Km || 0,
          });
        }
      })
      .catch((err) => console.error("Error al cargar datos del vehículo:", err));
  }, [id]);

  const handleChange = (e) => {
    setVehicle({ ...vehicle, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const confirmar = window.confirm("¿Está seguro de que desea actualizar este vehículo?");
    if (!confirmar) return;

    api.post(`http://127.0.0.1:5000/vehicles/Actualizar/${id}`, vehicle)
      .then(() => {
        alert("Vehículo actualizado correctamente");
        navigate("/");
      })
      .catch((error) => {
        console.error("Error al actualizar vehículo:", error);
        alert("Error al actualizar el vehículo");
      });
  };

  return (
    <div className="container">
      <h2>Editar Vehículo</h2>
      <form onSubmit={handleSubmit}>
        {Object.entries(vehicle).map(([key, value]) => (
          <div key={key} className="form-group">
            <label>{key}</label>
            <input
              type={typeof value === "number" ? "number" : "text"}
              name={key}
              value={value}
              onChange={handleChange}
              required
            />
          </div>
        ))}
        <div className="form-buttons">
          <button type="submit" className="btn">Actualizar</button>
          <Link to="/" className="btn btn-secondary">Regresar</Link>
        </div>
      </form>
    </div>
  );
};

export default EditVehicle;
