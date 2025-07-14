import React, { useState, useEffect } from "react";
import Select from "react-select";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import "./App.css";

const CheckList = () => {
  const navigate = useNavigate();

  const [vehicleId, setVehicleId] = useState("");
  const [usuarios, setUsuarios] = useState([]);

  const [checklistData, setChecklistData] = useState({
    fecha: new Date().toISOString().slice(0, 16),
    idUsuarioEntrega: "",
    idUsuarioRecibe: "",
    idEvento: "",
  });

  const [accesorios, setAccesorios] = useState({
    Luces: false,
    Direccionales: false,
    Intermitentes: false,
    Cuartos: false,
    LuzdeFreno: false,
    LuzdeReversa: false,
    LuzInterior: false,
    LuzTablero: false,
    Bocinas: false,
    Reloj: false,
    Tapetes: false,
    Aire: false,
    Claxon: false,
    Limpiadores: false,
    Encendedor: false,
    Estereo: false,
    ElevedordeCristal: false,
    LlantaRefacion: false,
    GatoyLlave: false,
    Herramienta: false,
    TaponesPolveras: false,
    Extintor: false,
  });

  useEffect(() => {
    api
      .get("/usuarios")
      .then((res) => {
        const options = res.data.map((user) => ({
          value: user.IdUsuario,
          label: `${user.Nombre} ${user.ApellidoPat} ${user.ApellidoMat}`,
        }));
        setUsuarios(options);
      })
      .catch((err) => console.error("Error al cargar usuarios", err));
  }, []);

  const handleChecklistChange = (e) => {
    setChecklistData({ ...checklistData, [e.target.name]: e.target.value });
  };

  const handleAccesorioChange = (e) => {
    setAccesorios({ ...accesorios, [e.target.name]: e.target.checked });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handleSubmit ACTIVADO");
  
    // Validación rápida
    if (
      !vehicleId ||
      !checklistData.idUsuarioEntrega ||
      !checklistData.idUsuarioRecibe ||
      !checklistData.idEvento
    ) {
      alert("Por favor complete todos los campos obligatorios");
      return;
    }
  
    console.log("Datos del formulario:");
    console.log("vehicleId:", vehicleId);
    console.log("checklistData:", checklistData);
    console.log("accesorios:", accesorios);
  
    const checkListProof = {
      IdVehiculo: parseInt(vehicleId),
      Fecha: checklistData.fecha,
      IdUsuarioEntrega: checklistData.idUsuarioEntrega,
      IdUsuarioRecibe: checklistData.idUsuarioRecibe,
      IdEvento: checklistData.idEvento,
    };
  
    console.log("Objeto a enviar:", checkListProof);
  
    try {
      const checklistRes = await api.post("/checklist", checkListProof);
      console.log(checklistRes);
      // await api.post("/checklist/accesorios", {
      //   ...accesorios,
      //   IdCheckList: idCheckList,
      // });
  
      alert("Checklist registrado (simulado)");
    //   navigate("/");
    } catch (error) {
      console.error("Error al registrar checklist:", error);
      alert("Ocurrió un error al guardar el checklist");
    }
  };
  

  return (
    <div className="entry-container">
      <h2 className="entry-title">Registrar Checklist de Vehículo</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>ID Vehículo:</label>
          <input
            type="number"
            value={vehicleId}
            onChange={(e) => setVehicleId(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Fecha:</label>
          <input
            type="datetime-local"
            name="fecha"
            value={checklistData.fecha}
            onChange={handleChecklistChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Usuario Entrega:</label>
          <Select
            options={usuarios}
            value={usuarios.find(
              (u) => u.value === checklistData.idUsuarioEntrega
            )}
            onChange={(option) =>
              setChecklistData({
                ...checklistData,
                idUsuarioEntrega: option.value,
              })
            }
            placeholder="Seleccionar usuario..."
          />
        </div>

        <div className="form-group">
          <label>Usuario Recibe:</label>
          <Select
            options={usuarios}
            value={usuarios.find(
              (u) => u.value === checklistData.idUsuarioRecibe
            )}
            onChange={(option) =>
              setChecklistData({
                ...checklistData,
                idUsuarioRecibe: option.value,
              })
            }
            placeholder="Seleccionar usuario..."
          />
        </div>

        <div className="form-group">
          <label>ID Evento:</label>
          <input
            type="number"
            name="idEvento"
            value={checklistData.idEvento}
            onChange={handleChecklistChange}
            required
          />
        </div>
        <h3>Accesorios</h3>
        <div className="accesorios-grid">
          {Object.entries(accesorios).map(([key, value]) => (
            <label key={key} className="accesorio-item">
              <input
                type="checkbox"
                name={key}
                checked={value}
                onChange={handleAccesorioChange}
              />
              <span>{key}</span>
            </label>
          ))}
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn-submit">
            Registrar Checklist
          </button>
          <Link to="/" className="btn-cancel">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
};

export default CheckList;
