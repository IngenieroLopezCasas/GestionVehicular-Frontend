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
import { Import } from "lucide-react";
import HistorialVehiculos from "./components/HistorialVehiculos";




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/historial-vehiculos" element={<HistorialVehiculos/>}></Route>
        <Route path="/checklist" element={<CheckList />} />
        <Route path="/salida-vehiculo" element={<SalidaVehiculo />} />
        <Route path="/edit-vehicle/:id" element={<EditVehicle />} />
        <Route path="/" element={<Home />} />
        <Route path="/details/:id" element={<VehicleDetails />} />
        <Route path="/add-vehicle" element={<AddVehicle />} />
        <Route path="/vehicles" element={<VehicleList />} />
        <Route path="/bitacora" element={<Bitacora />} />
        <Route path="/edit-vehicle/:id" element={<EditVehicle />} />
        <Route path="/registrar-marca" element={<RegistrarMarca />} />
      </Routes>
    </Router>
  );
}

export default App;
