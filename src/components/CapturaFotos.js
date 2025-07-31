import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const CapturaFotos = () => {
  const { idEvento } = useParams(); // 👈 Se recibe el ID desde la URL
  const [fotos, setFotos] = useState([]);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mediaStream = null;

    const iniciarCamara = async () => {
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 320, height: 240 },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (error) {
        alert("No se pudo acceder a la cámara.");
        console.error(error);
      }
    };

    iniciarCamara();

    return () => {
      if (mediaStream) mediaStream.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const tomarFoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = 320;
    canvas.height = 240;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        setFotos((prev) => [...prev, { blob, url }]);
      }
    }, "image/png");
  };

  const handleSubirFotos = async () => {
    if (!idEvento) {
      alert("idEvento es obligatorio.");
      return;
    }
    if (fotos.length === 0) {
      alert("No hay fotos para subir.");
      return;
    }

    const formData = new FormData();
    fotos.forEach(({ blob }, i) => {
      formData.append("imagenes", blob, `foto_${Date.now()}_${i}.png`);
    });
    formData.append("idEvento", idEvento);

    try {
      const res = await fetch("http://localhost:5000/fotos/agregar", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Error al subir imágenes.");

      alert("✅ Fotos subidas correctamente.");
      setFotos([]);
      navigate("/historial-vehiculos"); // ✅ Redirige al historial después de subir
    } catch (error) {
      alert("❌ Error al subir imágenes");
      console.error(error);
    }
  };

  return (
    <div style={{ marginTop: "30px", textAlign: "center" }}>
      <h3>Captura de Fotos</h3>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          width: "160px",
          height: "120px",
          borderRadius: "6px",
          backgroundColor: "#000",
          margin: "0 auto",
          display: "block",
        }}
      />

      <canvas ref={canvasRef} style={{ display: "none" }} />

      <div style={{ margin: "15px 0", display: "flex", justifyContent: "center", gap: "10px" }}>
        <button
          onClick={tomarFoto}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
          }}
        >
          Tomar Foto
        </button>

        <button
          onClick={handleSubirFotos}
          style={{
            padding: "10px 20px",
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
          }}
        >
          Subir Fotos
        </button>

        <button
          onClick={() => navigate("/historial-vehiculos")}
          style={{
            padding: "10px 20px",
            backgroundColor: "#6c757d",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
          }}
        >
          Cancelar
        </button>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
        {fotos.map(({ url }, i) => (
          <img
            key={i}
            src={url}
            alt={`foto-${i}`}
            style={{
              width: 60,
              height: 45,
              objectFit: "cover",
              borderRadius: 6,
              border: "1px solid #ccc",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default CapturaFotos;
