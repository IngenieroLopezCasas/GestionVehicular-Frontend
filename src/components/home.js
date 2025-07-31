// Home.js
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // AÑADIDO useNavigate
import { Plus, Edit, Trash, LogOut } from "lucide-react"; // AÑADIDO LogOut
import api from "../services/api";
import "./App.css";

const Home = () => {
  const [vehicles, setVehicles] = useState([]);
  const [expandedCardId, setExpandedCardId] = useState(null);
  const [historial, setHistorial] = useState([]);
  const navigate = useNavigate(); // NUEVO

  useEffect(() => {
    api.get("/vehicles")
      .then((res) => setVehicles(res.data))
      .catch((err) => console.error("Error al obtener vehículos", err));
  }, []);

  const deleteVehicle = (id) => {
    if (window.confirm("¿Está seguro que desea eliminar este vehículo?")) {
      api.post(`/vehicles/baja/${id}`)
        .then(() => {
          setVehicles(vehicles.filter((v) => v.IdVehiculos !== id));
          alert("Vehículo eliminado");
        })
        .catch((err) => alert("Error al eliminar el vehículo"));
    }
  };

  const fetchHistorial = async (id) => {
    if (expandedCardId === id) {
      setExpandedCardId(null);
      return;
    }

    try {
      const response = await api.get(`/vehicles/historial/${id}`);
      setHistorial(response.data);
      setExpandedCardId(id);
    } catch (error) {
      console.error("Error al obtener el historial", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    alert("👋 Sesión cerrada correctamente.");
    navigate("/login");
  };

  return (
    <div className="container">
      <header style={{ position: "relative" }}>
        <h1 className="header-title">Sistema de Información Vehicular</h1>
        <p className="header-subtitle">CRT</p>

        {/* 🔒 Botón de Logout */}
        <button
          onClick={handleLogout}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "5px",
            padding: "8px 12px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </header>

      <div className="button-group">
        <Link to="/salida-vehiculo" className="btn btn-secondary mt-4">Registrar Salida</Link>
        <Link to="/bitacora" className="btn btn-secondary mt-4">Registrar Entrada</Link>
        <Link to="/checklist" className="btn btn-secondary mt-4">CheckList</Link>
        <Link to="/historial-vehiculos" className="btn btn-secondary mt-4">Historial</Link>
      </div>

      <div className="main-content">
        <div className="cards-grid">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.IdVehiculos}
              className={`card ${expandedCardId === vehicle.IdVehiculos ? 'expanded' : ''}`}
              onClick={() => fetchHistorial(vehicle.IdVehiculos)}
            >
              <div className="card-buttons" onClick={(e) => e.stopPropagation()}>
                <Link to={`/edit-vehicle/${vehicle.IdVehiculos}`}>
                  <button className="button-icon"><Edit size={16} /></button>
                </Link>
                <button className="button-icon" onClick={() => deleteVehicle(vehicle.IdVehiculos)}>
                  <Trash size={16} />
                </button>
              </div>

              <div className="card-image">
                <span>No Image</span>
              </div>

              <h3 className="card-title">{vehicle.Marca} {vehicle.Submarca}</h3>
              <p className="card-text">{vehicle.Modelo} - {vehicle.Placas}</p>

              {expandedCardId === vehicle.IdVehiculos && (
                <div className="card-historial">
                  <h4>Últimos desplazamientos</h4>
                  {historial.length === 0 ? (
                    <p>No hay registros disponibles.</p>
                  ) : (
                    <ul>
                      {historial.map((d, idx) => (
                        <li key={idx}>
                          <strong>Salida:</strong> {new Date(d.Salida).toLocaleString()}<br />
                          <strong>Entrada:</strong> {d.Entrada ? new Date(d.Entrada).toLocaleString() : "No registrada"}<br />
                          <strong>KM:</strong> {d.KmSalida} → {d.KmEntrada ?? "?"}, 
                          <strong> Tanque:</strong> {d.TanqueSalida} → {d.TanqueEntrada ?? "?"}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Link to="/add-vehicle" className="floating-button" title="Agregar">
        <Plus size={24} />
      </Link>
    </div>
  );
};

export default Home;
