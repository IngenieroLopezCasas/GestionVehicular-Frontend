// EntryForm.js

import React, { useState, useEffect } from "react";
import Select from "react-select";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { QrReader } from "react-qr-reader";
import CapturaFotos from "./CapturaFotos"; // 👈 Verifique ruta correcta
import "./App.css";

const EntryForm = () => {
  const navigate = useNavigate();
  const [vehicleId, setVehicleId] = useState("");
  const [mostrarQR, setMostrarQR] = useState(false);
  const [mostrarCamara, setMostrarCamara] = useState(false); // Nuevo estado para cámara
  const [vehicleData, setVehicleData] = useState(null);
  const [idDesplazamiento, setIdDesplazamiento] = useState(null);
  const [entryData, setEntryData] = useState({
    km: "",
    gasolina: "",
    idUsuario: "",
    fecha: new Date().toISOString().slice(0, 16),
  });
  const [usuariosOptions, setUsuariosOptions] = useState([]);

  useEffect(() => {
    api.get("/usuarios")
      .then((res) => {
        const options = res.data.map((user) => ({
          value: user.IdUsuario,
          label: `${user.Nombre} ${user.ApellidoPat} ${user.ApellidoMat}`,
        }));
        setUsuariosOptions(options);
      })
      .catch((err) => {
        console.error("Error al obtener usuarios:", err);
      });
  }, []);

  const obtenerUltimoDesplazamiento = async (idVehiculo) => {
    try {
      const res = await api.get(`/desplazamientos/ultimo/${idVehiculo}`);
      if (res.data && res.data.IdDesplazamiento) {
        setIdDesplazamiento(res.data.IdDesplazamiento);
      } else {
        console.warn("No se encontró desplazamiento para este vehículo.");
        setIdDesplazamiento(null);
      }
    } catch (err) {
      console.error("Error al obtener el último desplazamiento:", err);
    }
  };

  const handleQrReadFromCodigo = async (codigoQR) => {
    const isNumeric = /^\d+$/.test(codigoQR);
    try {
      let res;
      if (isNumeric) {
        res = await api.get(`/vehicles/entradas/${codigoQR}`);
      } else {
        res = await api.get(`/vehicles/por-qr/${codigoQR}`);
      }

      if (res.data.status === "ok" || res.data.vehiculo) {
        const vehiculo = res.data.vehiculo || res.data;
        const idVehiculo = vehiculo.IdVehiculos || vehiculo.IdVehiculo;
        setVehicleId(idVehiculo);
        setVehicleData(vehiculo);
        obtenerUltimoDesplazamiento(idVehiculo);
      } else {
        alert("Vehículo no encontrado por QR o ID");
      }
    } catch (err) {
      console.error("Error al buscar vehículo por QR:", err);
      alert("Error al buscar vehículo por QR o ID");
    }
  };

  const handleQrRead = async () => {
    try {
      const res = await api.get(`vehicles/entradas/${vehicleId}`);
      if (res.data.status === "ok") {
        setVehicleData(res.data.vehiculo);
        obtenerUltimoDesplazamiento(vehicleId);
      } else {
        alert("Vehículo no encontrado");
        setVehicleData(null);
      }
    } catch (err) {
      console.error("Error al buscar vehículo:", err);
    }
  };

  const handleChange = (e) => {
    setEntryData({ ...entryData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("vehicles/entradas", {
        ...entryData,
        idvehiculo: vehicleId,
      });
      alert("Entrada registrada correctamente");
      navigate("/");
    } catch (error) {
      console.error("Error al guardar entrada:", error);
      alert("Error al guardar la entrada");
    }
  };

  return (
    <div className="entry-container">
      <h2 className="entry-title">Registro de Entrada de Vehículo</h2>

      <div className="qr-input">
        <label>Escanear o ingresar ID del Vehículo:</label>
        <input
          type="text"
          value={vehicleId}
          onChange={(e) => setVehicleId(e.target.value)}
          placeholder="Ej. 12 o ABC123QR"
          required
        />
        <button onClick={handleQrRead}>Buscar Vehículo</button>
        <button type="button" onClick={() => setMostrarQR(!mostrarQR)}>
          {mostrarQR ? "Cerrar Cámara QR" : "Escanear QR"}
        </button>
        {/* Botón para controlar cámara de captura de fotos */}
        <button type="button" onClick={() => setMostrarCamara(!mostrarCamara)} style={{ marginLeft: "10px" }}>
          {mostrarCamara ? "Cerrar Cámara Fotos" : "Abrir Cámara Fotos"}
        </button>
      </div>

      {mostrarQR && (
        <div className="qr-box">
          <QrReader
            constraints={{ facingMode: "environment" }}
            onResult={(result, error) => {
              if (!!result) {
                const scanned = result?.text?.trim();
                handleQrReadFromCodigo(scanned);
                setMostrarQR(false);
              }
            }}
          />
        </div>
      )}

      <div className="entry-grid">
        <div className="entry-left">
          <h3>Datos del Vehículo</h3>
          {vehicleData ? (
            <ul>
              <li><strong>Placas:</strong> {vehicleData.Placas}</li>
              <li><strong>Marca:</strong> {vehicleData.Marca}</li>
              <li><strong>Submarca:</strong> {vehicleData.Submarca}</li>
              <li><strong>Modelo:</strong> {vehicleData.Modelo}</li>
              <li><strong>Color:</strong> {vehicleData.Color}</li>
              <li><strong>Unidad:</strong> {vehicleData.Unidad}</li>
              <li><strong>Transmisión:</strong> {vehicleData.Transmision}</li>
            </ul>
          ) : (
            <p className="vehicle-empty">No hay datos cargados</p>
          )}
        </div>

        <div className="entry-right">
          <h3>Datos de Entrada</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Fecha y hora de entrada:</label>
              <input
                type="datetime-local"
                name="fecha"
                value={entryData.fecha}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Kilometraje actual:</label>
              <input
                type="number"
                name="km"
                value={entryData.km}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Nivel de gasolina (%):</label>
              <input
                type="number"
                name="gasolina"
                min="0"
                max="100"
                value={entryData.gasolina}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Registrar estado físico del vehículo:</label>
              <button
                type="button"
                className="btn-incidente"
                onClick={() => navigate(`/evento/${idDesplazamiento}`)}
                disabled={!idDesplazamiento}
              >
                Ir a Formulario de Evento
              </button>
            </div>

            <div className="form-group">
              <label>Entregado por:</label>
              <Select
                options={usuariosOptions}
                value={usuariosOptions.find(
                  (opt) => opt.value === entryData.idUsuario
                )}
                onChange={(selectedOption) =>
                  setEntryData({ ...entryData, idUsuario: selectedOption.value })
                }
                placeholder="Buscar usuario..."
                isSearchable
                required
              />
            </div>

            <div className="form-buttons">
              <button type="submit" className="btn-submit">Registrar Entrada</button>
              <Link to="/" className="btn-cancel">Cancelar</Link>
            </div>
          </form>
        </div>
      </div>

      {/* Mostrar cámara de captura de fotos sólo si se activó y existe vehicleId */}
      {mostrarCamara && vehicleId && (
        <div className="entry-fotos">
          <h3>Captura de Fotos del Vehículo</h3>
          <CapturaFotos idEvento={vehicleId} />
        </div>
      )}
    </div>
  );
};

export default EntryForm;
