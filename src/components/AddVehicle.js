import React, { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import "./App.css";

const AddVehicle = () => {
  const [formData, setFormData] = useState({
    marca: "",
    modelo: "",
    placas: "",
    color: "",
    serie: "",
    unidad: "",
    transmision: "",
    iddepartamento: "",
    submarca: "",
    estatus: "",
  });











  

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSend = { ...formData, km: parseInt(formData.km || 0, 10) };
    api.post("http://127.0.0.1:5000/vehicles/Agregar", dataToSend)
      .then(() => {
        alert("Vehículo agregado exitosamente");
        navigate("/vehicles");
      })
      .catch((error) => {
        console.error("Error al agregar vehículo:", error);
        alert("Error al agregar el vehículo");
      });
  };

  return (
    <div className="container">
      <header>
        <h1 className="header-title">SIV</h1>
        <p className="header-subtitle">CRT</p>
      </header>

      <nav className="nav">
        <Link to="/">Inicio</Link>
        <Link to="/">Ver Vehículos</Link>
      </nav>

      <form onSubmit={handleSubmit} className="form-container">
        <h2>Agregar Vehículo</h2>

        <div className="form-group">
          <label>Marca:</label>
          <select
            name="marca"
            value={formData.marca}
            onChange={handleChange}
            required
            className="form-control"
          >
            <option value="">Seleccione una marca</option>
            <option value="RENAULT">Renault</option>
            <option value="NISSAN">Nissan</option>
            <option value="CHEVROLET">Chevrolet</option>
            <option value="TOYOTA">Toyota</option>
            <option value="MITSUBISHI">Mitsubishi</option>
            <option value="FORD">Ford</option>
            <option value="GENERAL MOTORS">General Motors</option>
            <option value="VOLVO">Volvo</option>
            <option value="MERCEDES BENZ">Mercedes Benz</option>
            <option value="MAZDA">Mazda</option>
            <option value="CHRYSLER">Chrysler</option>
          </select>
        </div>

        <div className="form-group">
          <label>Submarca:</label>
          <input
            type="text"
            name="submarca"
            value={formData.submarca}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Modelo:</label>
          <input
            type="text"
            name="modelo"
            value={formData.modelo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Placas:</label>
          <input
            type="text"
            name="placas"
            value={formData.placas}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Color:</label>
          <input
            type="text"
            name="color"
            value={formData.color}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Serie:</label>
          <input
            type="text"
            name="serie"
            value={formData.serie}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Unidad:</label>
          <input
            type="text"
            name="unidad"
            value={formData.unidad}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Transmisión:</label>
          <input
            type="text"
            name="transmision"
            value={formData.transmision}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>ID Departamento:</label>
          <input
            type="text"
            name="iddepartamento"
            value={formData.iddepartamento}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="submit-button">
          Agregar Vehículo
        </button>
      </form>
    </div>
  );
};

export default AddVehicle;
