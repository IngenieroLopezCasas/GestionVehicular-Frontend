// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import VehicleDetails from "./components/vehicleDetails";
import AddVehicle from "./components/AddVehicle";
import VehicleList from "./components/VehicleList";
import Bitacora from "./components/Bitacora";
import RegistrarMarca from "./components/RegistraMarca";
import EditVehicle from "./components/EditVehicle";
import SalidaVehiculo from "./components/SalidaVehiculo";
import CheckList from "./components/CheckList";
import HistorialVehiculos from "./components/HistorialVehiculos";
import FormularioEvento from "./components/FormularioEvento";
import CapturaFotos from "./components/CapturaFotos";
import Login from "./components/Login";

// 🛡️ Importar la ruta protegida
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* RUTA PÚBLICA */}
        <Route path="/login" element={<Login />} />

        {/* RUTAS PROTEGIDAS */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bitacora"
          element={
            <ProtectedRoute>
              <Bitacora />
            </ProtectedRoute>
          }
        />
        <Route
          path="/salida-vehiculo"
          element={
            <ProtectedRoute>
              <SalidaVehiculo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-vehicle"
          element={
            <ProtectedRoute>
              <AddVehicle />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-vehicle/:id"
          element={
            <ProtectedRoute>
              <EditVehicle />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checklist"
          element={
            <ProtectedRoute>
              <CheckList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/historial-vehiculos"
          element={
            <ProtectedRoute>
              <HistorialVehiculos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/details/:id"
          element={
            <ProtectedRoute>
              <VehicleDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vehicles"
          element={
            <ProtectedRoute>
              <VehicleList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/registrar-marca"
          element={
            <ProtectedRoute>
              <RegistrarMarca />
            </ProtectedRoute>
          }
        />
        <Route
          path="/evento/:idDesplazamiento"
          element={
            <ProtectedRoute>
              <FormularioEvento />
            </ProtectedRoute>
          }
        />
        <Route
          path="/captura-fotos/:idEvento"
          element={
            <ProtectedRoute>
              <CapturaFotos />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
