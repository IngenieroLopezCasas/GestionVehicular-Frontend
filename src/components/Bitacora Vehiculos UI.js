import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const BitacoraVehiculos = () => {
  const [registros, setRegistros] = useState([]);
  const [nuevoRegistro, setNuevoRegistro] = useState({
    fecha: '',
    numEconomico: '',
    kmSalida: '',
    nombreConductor: '',
    motivo: '',
    horaSalida: '',
    horaEntrada: '',
    observaciones: ''
  });

  const handleChange = (e) => {
    setNuevoRegistro({ ...nuevoRegistro, [e.target.name]: e.target.value });
  };

  const agregarRegistro = () => {
    setRegistros([...registros, nuevoRegistro]);
    setNuevoRegistro({
      fecha: '',
      numEconomico: '',
      kmSalida: '',
      nombreConductor: '',
      motivo: '',
      horaSalida: '',
      horaEntrada: '',
      observaciones: ''
    });
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <Input placeholder="Fecha" name="fecha" value={nuevoRegistro.fecha} onChange={handleChange} />
            <Input placeholder="N° Económico" name="numEconomico" value={nuevoRegistro.numEconomico} onChange={handleChange} />
            <Input placeholder="KM de Salida" name="kmSalida" value={nuevoRegistro.kmSalida} onChange={handleChange} />
            <Input placeholder="Nombre del Conductor" name="nombreConductor" value={nuevoRegistro.nombreConductor} onChange={handleChange} />
            <Input placeholder="Motivo del viaje" name="motivo" value={nuevoRegistro.motivo} onChange={handleChange} />
            <Input placeholder="Hora de Salida" name="horaSalida" value={nuevoRegistro.horaSalida} onChange={handleChange} />
            <Input placeholder="Hora de Entrada" name="horaEntrada" value={nuevoRegistro.horaEntrada} onChange={handleChange} />
            <Input placeholder="Observaciones" name="observaciones" value={nuevoRegistro.observaciones} onChange={handleChange} />
          </div>
          <Button onClick={agregarRegistro} className="w-full">Agregar Registro</Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Fecha</th>
                <th className="p-2">N° Económico</th>
                <th className="p-2">KM de Salida</th>
                <th className="p-2">Conductor</th>
                <th className="p-2">Motivo</th>
                <th className="p-2">Salida</th>
                <th className="p-2">Entrada</th>
                <th className="p-2">Observaciones</th>
              </tr>
            </thead>
            <tbody>
              {registros.map((r, i) => (
                <tr key={i} className="border-t">
                  <td className="p-2">{r.fecha}</td>
                  <td className="p-2">{r.numEconomico}</td>
                  <td className="p-2">{r.kmSalida}</td>
                  <td className="p-2">{r.nombreConductor}</td>
                  <td className="p-2">{r.motivo}</td>
                  <td className="p-2">{r.horaSalida}</td>
                  <td className="p-2">{r.horaEntrada}</td>
                  <td className="p-2">{r.observaciones}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default BitacoraVehiculos;
