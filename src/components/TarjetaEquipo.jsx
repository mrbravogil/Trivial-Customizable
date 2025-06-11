import React, { useState, useRef, useEffect } from "react";
import { Switch } from "@headlessui/react";
import { useTurnoStore } from "../hooks/useTurnoStore";
import ninioAvatar from "../assets/img/ninio.png";

/**
 * Tarjeta editable para configurar un equipo.
 * - Cambia nombre, integrantes, avatar y habilita/deshabilita el equipo.
 * - Resalta en amarillo cuando es el turno de ese equipo dentro del tablero.
 * - Llama a `onUpdate()` cada vez que algo importante cambia.
 */
function TarjetaEquipo({
  nombreInicial = "Equipo 1",
  jugadoresIniciales = [
    "JUGADOR 1",
    "JUGADOR 2",
    "JUGADOR 3",
    "JUGADOR 4",
    "JUGADOR 5",
  ],
  onUpdate,
}) {
  /* ---------- Estado local ---------- */
  const [enabled, setEnabled]       = useState(false);
  const [imagenPerfil, setImagen]   = useState(null);
  const [imagenFile, setImagenFile] = useState(null);
  const [nombre, setNombre]         = useState(nombreInicial);
  const [jugadores, setJugadores]   = useState(
    jugadoresIniciales?.length
      ? jugadoresIniciales
      : ["JUGADOR 1", "JUGADOR 2", "JUGADOR 3", "JUGADOR 4", "JUGADOR 5"]
  );

  const fileInputRef = useRef(null);

  /* ---------- Saber si es turno para colorear ---------- */
  const turnoActual = useTurnoStore((s) => s.turnoActual);
  const equipos     = useTurnoStore((s) => s.equipos);
  const esTurno =
    equipos.length &&
    equipos[turnoActual]?.nombre === nombre &&
    window.location.pathname === "/tablero";

  /* ---------- Avisar al padre cuando algo cambia ---------- */
  useEffect(() => {
    onUpdate?.({ nombre, integrantes: jugadores, imagen: imagenPerfil, imagenFile: imagenFile, enabled });
  }, [nombre, jugadores, imagenPerfil, enabled]);

  /* ---------- Handlers ---------- */
  const subirImagen = () => fileInputRef.current.click();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImagen(URL.createObjectURL(file));
    setImagenFile(file);
  };

  const handleJugadorInput = (e, index) => {
    const nuevos = [...jugadores];
    nuevos[index] = e.target.value;
    setJugadores(nuevos);
  };

  /* ---------- Render ---------- */
  return (
    <div
      className={`w-48 rounded-xl shadow-xl p-4 flex flex-col items-center border border-black
        ${
          esTurno
            ? "bg-yellow-300 border-4 border-yellow-500 scale-105"
            : "bg-[#f6eddc]"
        }`}
    >
      {/* Avatar */}
      <div className="relative w-24 h-24 mb-2">
        <img
          src={imagenPerfil || ninioAvatar}
          alt="Avatar"
          className="w-full h-full object-cover rounded-full border-2 border-black"
        />
        {/* Botón + para subir imagen */}
        <button
          onClick={subirImagen}
          className="absolute bottom-0 right-0 w-5 h-5 bg-black text-white text-xl rounded-full flex items-center justify-center z-20"
        >
          +
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleImageChange}
        />
      </div>

      {/* Nombre + switch de habilitado */}
      <div className="flex justify-between items-center border border-black px-3 py-1 w-full mb-2">
        <span
          className="italic font-semibold text-black focus:outline-none"
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => setNombre(e.target.innerText)}
        >
          {nombre}
        </span>

        <Switch
          checked={enabled}
          onChange={setEnabled}
          className={`${
            enabled ? "bg-black" : "bg-[#d7c3b8]"
          } relative inline-flex h-6 w-12 items-center rounded-full border border-black transition`}
        >
          <span
            className={`${
              enabled ? "translate-x-6" : "translate-x-1"
            } inline-block h-4 w-4 transform bg-[#f6eddc] rounded-full transition`}
          />
        </Switch>
      </div>

      {/* Lista de jugadores */}
      <div className="bg-black text-white w-full p-3 rounded-md border border-black">
        <ul className="space-y-2 font-bold tracking-wide">
          {jugadores.map((jugador, index) => (
            <li key={index}>
              <input
                type="text"
                value={jugador}
                onChange={(e) => handleJugadorInput(e, index)}
                className="w-full px-2 py-1 text-black rounded-md text-center font-lemon"
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TarjetaEquipo;