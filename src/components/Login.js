// src/components/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import api from "../services/api";

const Login = () => {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Login rápido para admin/admin
    if (usuario === "admin" && contrasena === "admin") {
      const usuarioCompleto = {
        nombre: "Adminitrador Lopez ",
        rol: "administrador",
        usuarioInterno: true,
      };
      localStorage.setItem("usuario", JSON.stringify(usuarioCompleto));
      navigate("/");
      return;
    }

    // Login normal vía API
    try {
      const response = await api.post(
        "https://intranet.tequila.org.mx/intranetlogin/api/Auth/ConCredenciales",
        {
          username: usuario,
          password: contrasena,
        }
      );

      const datos = response.data;

      if (
        datos?.result?.success === true &&
        datos.result.user?.usuarioInterno === true
      ) {
        const usuarioCompleto = {
          nombre: datos.result.user.nombre,
          rol: (datos.result.user.rol || "usuario").toLowerCase(),
          ...datos.result.user,
        };

        localStorage.setItem("usuario", JSON.stringify(usuarioCompleto));

        if (usuarioCompleto.rol === "administrador" || usuarioCompleto.rol === "admin") {
          navigate("/admin");
        } else if (usuarioCompleto.rol === "vigilante") {
          navigate("/vigilante");
        } else {
          navigate("/");
        }
      } else {
        alert("❌ Acceso denegado: Usuario inválido o no autorizado.");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      alert("❌ Error al conectarse con el servidor. Verifique su conexión.");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Iniciar sesión</h2>
        <input
          type="text"
          placeholder="Usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          required
        />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
};

export default Login;
