// src/pages/VehicleList.jsx
import React, { useState, useEffect } from "react";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import { Edit, Trash } from "lucide-react";

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/vehicles")
      .then((response) => {
        console.log("estoy en list", response.data);
        setVehicles(response.data);
      })
      .catch((error) => console.error("Error al obtener vehículos:", error));
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("¿Está seguro de dar de baja este vehículo?")) {
      api.delete(`/vehicles/${id}`)
        .then(() => {
          alert("Vehículo dado de baja correctamente");
          setVehicles(vehicles.filter(vehicle => vehicle.IdVehiculos !== id));
        })
        .catch((error) => {
          console.error("Error al eliminar vehículo:", error);
          alert("Error al eliminar el vehículo");
        });
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-vehicle/${id}`);
  };

  return (
    <div className="container">
      <header>
        <h1 className="header-title">SIV</h1>
        <p className="header-subtitle">CRT</p>
      </header>

      <nav className="nav">
        <Link to="/">Inicio</Link>
        <Link to="/add-vehicle">Agregar Vehículo</Link>
      </nav>

      <div className="main-content">
        <h2>Lista de Vehículos</h2>
        <div className="cards-grid">
          {vehicles.map((vehicle) => (
            <div key={vehicle.IdVehiculos} className="card">
              <div className="card-buttons">
                <button className="button-icon" onClick={() => handleEdit(vehicle.IdVehiculos)} title="Editar">
                  <Edit size={16} />
                </button>
                <button className="button-icon" onClick={() => handleDelete(vehicle.IdVehiculos)} title="Eliminar">
                  <Trash size={16} />
                </button>
              </div>
              <div className="card-image">
                <span>No Image</span>
              </div>
              <h3 className="card-title">
                {vehicle.Placas} - {vehicle.Modelo}
              </h3>
              <p className="card-text">
                {vehicle.Estatus} - {vehicle.Km || 0} km
              </p>
            </div>
          ))}+
        </div>
      </div>
    </div>
  );
};

export default VehicleList;
