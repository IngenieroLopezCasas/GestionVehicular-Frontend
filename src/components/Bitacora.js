import React, { useState, useEffect } from "react";
import Select from "react-select";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { QrReader } from "react-qr-reader";
import "./App.css";

const EntryForm = () => {
  const navigate = useNavigate();
  const [vehicleId, setVehicleId] = useState("");
  const [mostrarQR, setMostrarQR] = useState(false);
  const [vehicleData, setVehicleData] = useState(null);
  const [entryData, setEntryData] = useState({
    km: "",
    gasolina: "",
    estado: "",
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
          {mostrarQR ? "Cerrar Cámara" : "Escanear QR"}
        </button>
      </div>

      {mostrarQR && (
        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "500px",
            height: "400px",
            margin: "auto",
            border: "2px solid #ccc",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
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
              <label>Estado físico:</label>
              <textarea
                name="estado"
                value={entryData.estado}
                onChange={handleChange}
                rows="4"
                required
              ></textarea>
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
    </div>
  );
};

export default EntryForm;
