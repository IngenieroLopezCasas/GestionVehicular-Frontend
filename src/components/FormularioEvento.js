import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./App.css";

const FormularioEvento = () => {
  const { idDesplazamiento } = useParams();
  const [observacion, setObservacion] = useState("");
  const [imagenes, setImagenes] = useState([]);
  const [idEventoGenerado, setIdEventoGenerado] = useState(null);
  const [mostrarFormularioFotos, setMostrarFormularioFotos] = useState(false);
  const navigate = useNavigate();

  const handleImagenChange = (e) => {
    const files = Array.from(e.target.files);
    setImagenes(files);
  };

  const handleRegistrarEvento = async (e) => {
    e.preventDefault();
    try {
      const resEvento = await fetch("http://localhost:5000/evento/agregar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Observacion: observacion,
          IdDesplazamiento: idDesplazamiento,
        }),
      });

      const data = await resEvento.json();
      console.log(data);
      if (!resEvento.ok || !data.IdEvento) {
        throw new Error("No se pudo registrar el evento");
      }

      setIdEventoGenerado(data.IdEvento);
      setMostrarFormularioFotos(true);
      alert("✅ Evento registrado correctamente. Ahora puede agregar fotos o finalizar.");
    } catch (error) {
      alert("❌ Error al registrar el evento");
      console.error(error);
    }
  };

  const handleSubirFotos = async () => {
    if (imagenes.length === 0) {
      alert("Por favor seleccione imágenes para subir.");
      return;
    }

    const formData = new FormData();
    formData.append("idEvento", idEventoGenerado);

    imagenes.forEach((img) => {
      formData.append("fotos", img);
    });
     console.log("📦 Subiendo imágenes para evento ID:", formData.idEvento);
     console.log("🖼️ Archivos seleccionados:", formData.fotos);
     console.log("asadad: ", formData)
    try {
      const resSubida = await fetch("http://localhost:5000/fotos/agregar", {
        method: "POST",
        body: formData,
      });

      if (!resSubida.ok) throw new Error("Error al subir imágenes");

      alert("✅ Imágenes guardadas correctamente.");
      navigate("/historial-vehiculos");
    } catch (error) {
      alert("❌ Error al subir imágenes");
      console.error(error);
    }
  };

  const handleCancelar = () => {
    navigate("/historial-vehiculos");
  };

  // Estilos inline para un diseño limpio y profesional
  const styles = {
    container: {
      maxWidth: "600px",
      margin: "30px auto",
      padding: "25px",
      backgroundColor: "#f5f7fa",
      borderRadius: "12px",
      boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: "#333",
    },
    title: {
      textAlign: "center",
      marginBottom: "25px",
      fontWeight: "700",
      fontSize: "1.8rem",
      color: "#222",
      textTransform: "uppercase",
      letterSpacing: "2px",
    },
    label: {
      display: "block",
      fontWeight: "600",
      marginBottom: "8px",
      color: "#444",
    },
    textarea: {
      width: "100%",
      padding: "12px",
      borderRadius: "8px",
      border: "1px solid #ccc",
      fontSize: "1rem",
      resize: "vertical",
      fontFamily: "inherit",
    },
    fileInput: {
      display: "block",
      marginTop: "10px",
      fontSize: "1rem",
    },
    buttonGroup: {
      marginTop: "20px",
      display: "flex",
      justifyContent: "space-between",
      gap: "15px",
    },
    btnPrimary: {
      flex: "1",
      padding: "12px",
      backgroundColor: "#007bff",
      border: "none",
      borderRadius: "8px",
      color: "#fff",
      fontWeight: "600",
      cursor: "pointer",
      fontSize: "1.1rem",
      transition: "background-color 0.3s ease",
    },
    btnSecondary: {
      flex: "1",
      padding: "12px",
      backgroundColor: "#6c757d",
      border: "none",
      borderRadius: "8px",
      color: "#fff",
      fontWeight: "600",
      cursor: "pointer",
      fontSize: "1.1rem",
      transition: "background-color 0.3s ease",
    },
    linkButtonContainer: {
      marginTop: "30px",
      textAlign: "center",
    },
    linkButton: {
      padding: "12px 25px",
      fontSize: "1.1rem",
      fontWeight: "700",
      borderRadius: "8px",
      border: "none",
      backgroundColor: "#28a745",
      color: "#fff",
      cursor: "pointer",
      textDecoration: "none",
      display: "inline-block",
      transition: "background-color 0.3s ease",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Registrar Evento / Incidente</h2>

      {!mostrarFormularioFotos && (
        <>
          <form onSubmit={handleRegistrarEvento}>
            <label style={styles.label}>Observación:</label>
            <textarea
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
              required
              placeholder="Describa el evento, incidente o detalle relevante..."
              rows={5}
              style={styles.textarea}
            />

            <div style={styles.buttonGroup}>
              <button
                type="button"
                onClick={handleCancelar}
                style={styles.btnSecondary}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#5a6268")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "#6c757d")
                }
              >
                Cancelar
              </button>

              <button
                type="submit"
                style={styles.btnPrimary}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#0056b3")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "#007bff")
                }
              >
                Guardar Evento
              </button>
            </div>
          </form>

          {idEventoGenerado && (
            <div style={styles.linkButtonContainer}>
              <Link
                to={`/captura-fotos/${idEventoGenerado}`}
                style={styles.linkButton}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#1e7e34")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "#28a745")
                }
              >
                Ir a Capturar Fotos con Cámara
              </Link>
            </div>
          )}
        </>
      )}

      {mostrarFormularioFotos && (
        <div>
          <h3 style={{ marginBottom: "15px", color: "#444" }}>
            ¿Desea agregar fotos al reporte?
          </h3>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImagenChange}
            style={styles.fileInput}
          />
          <div style={styles.buttonGroup}>
            <button
              onClick={handleCancelar}
              style={styles.btnSecondary}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#5a6268")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#6c757d")
              }
            >
              Terminar sin fotos
            </button>
            <button
              onClick={handleSubirFotos}
              style={styles.btnPrimary}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#0056b3")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#007bff")
              }
            >
              Subir Fotos
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormularioEvento;
