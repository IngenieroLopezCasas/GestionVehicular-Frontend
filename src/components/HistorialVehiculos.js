import React, { useState, useEffect } from "react";
import Select from "react-select";
import api from "../services/api";
import { Link } from "react-router-dom";
import { QrReader } from "react-qr-reader";
import "./App.css";

const HistorialVehiculos = () => {
  const [vehicleId, setVehicleId] = useState("");
  const [mostrarQR, setMostrarQR] = useState(false);
  const [vehicleData, setVehicleData] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [filtro, setFiltro] = useState({
    fechaInicio: "",
    fechaFin: "",
  });

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
        fetchHistorial(idVehiculo);
      } else {
        alert("Vehículo no encontrado por QR o ID");
      }
    } catch (err) {
      console.error("Error al buscar vehículo por QR:", err);
      alert("Error al buscar vehículo por QR o ID");
    }
  };

  const fetchHistorial = async (id) => {
    try {
      const res = await api.get(`/vehicles/historial/${id}`);
      setHistorial(res.data);
    } catch (err) {
      console.error("Error al obtener historial:", err);
      alert("Error al obtener historial del vehículo");
    }
  };

  const handleBuscarVehiculo = async () => {
    try {
      const res = await api.get(`/vehicles/entradas/${vehicleId}`);
      if (res.data.status === "ok") {
        setVehicleData(res.data.vehiculo);
        fetchHistorial(vehicleId);
      } else {
        alert("Vehículo no encontrado");
        setVehicleData(null);
      }
    } catch (err) {
      console.error("Error al buscar vehículo:", err);
      alert("Error al buscar vehículo");
    }
  };

  const historialFiltrado = historial.filter((item) => {
    const fechaSalida = new Date(item.Salida);
    const inicio = filtro.fechaInicio ? new Date(filtro.fechaInicio) : null;
    const fin = filtro.fechaFin ? new Date(filtro.fechaFin) : null;
    return (
      (!inicio || fechaSalida >= inicio) &&
      (!fin || fechaSalida <= fin)
    );
  });

  return (
    <div className="entry-container">
      <h2 className="entry-title">Historial de Vehículo</h2>

      <div className="qr-input">
        <label>Escanear o ingresar ID del Vehículo:</label>
        <input
          type="text"
          value={vehicleId}
          onChange={(e) => setVehicleId(e.target.value)}
          placeholder="Ej. 12 o AB34R423"
          required
        />
        <button type="button" onClick={handleBuscarVehiculo}>
          Buscar Vehículo
        </button>
        <button type="button" onClick={() => setMostrarQR(!mostrarQR)}>
          {mostrarQR ? "Cerrar Cámara" : "Escanear QR"}
        </button>
      </div>

      {mostrarQR && (
        <div className="qr-box">
          <QrReader
            className="qr-reader"
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

      {vehicleData && (
        <>
          <div className="entry-grid">
            <div className="entry-left">
              <h3>Datos del Vehículo</h3>
              <ul>
                <li><strong>Placas:</strong> {vehicleData.Placas}</li>
                <li><strong>Marca:</strong> {vehicleData.Marca}</li>
                <li><strong>Submarca:</strong> {vehicleData.Submarca}</li>
                <li><strong>Modelo:</strong> {vehicleData.Modelo}</li>
                <li><strong>Color:</strong> {vehicleData.Color}</li>
                <li><strong>Unidad:</strong> {vehicleData.Unidad}</li>
                <li><strong>Transmisión:</strong> {vehicleData.Transmision}</li>
              </ul>
            </div>

            <div className="entry-right">
              <h3>Filtrar por Fecha</h3>
              <label>Fecha Inicio:</label>
              <input
                type="date"
                value={filtro.fechaInicio}
                onChange={(e) => setFiltro({ ...filtro, fechaInicio: e.target.value })}
              />
              <label>Fecha Fin:</label>
              <input
                type="date"
                value={filtro.fechaFin}
                onChange={(e) => setFiltro({ ...filtro, fechaFin: e.target.value })}
              />
            </div>
          </div>

          <div className="history-table">
            <h3>Historial de Desplazamientos</h3>
            <table>
              <thead>
                <tr>
                  <th>Salida</th>
                  <th>Entrada</th>
                  <th>KM (S → E)</th>
                  <th>Tanque (S → E)</th>
                </tr>
              </thead>
              <tbody>
                {historialFiltrado.map((h, i) => (
                  <tr key={i}>
                    <td>{new Date(h.Salida).toLocaleString()}</td>
                    <td>{h.Entrada ? new Date(h.Entrada).toLocaleString() : "No registrada"}</td>
                    <td>{h.KmSalida} → {h.KmEntrada ?? "?"}</td>
                    <td>{h.TanqueSalida} → {h.TanqueEntrada ?? "?"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <Link to="/" className="btn-cancel">Volver al inicio</Link>
    </div>
  );
};

export default HistorialVehiculos;
