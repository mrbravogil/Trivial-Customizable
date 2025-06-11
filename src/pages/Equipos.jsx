import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import TarjetaEquipo from "../components/TarjetaEquipo";
import { usePartidaStore } from "../hooks/usePartidaStore";
import { useTurnoStore } from "../hooks/useTurnoStore";
import { QuizSetupContext } from "../context/QuizSetupContext";

export default function Equipos() {
  const navigate = useNavigate();
  const { 
    selectedCategory, 
    selectedFile, 
    selectedTeams, 
    setSelectedTeams 
  } = useContext(QuizSetupContext);

  const setPartida = usePartidaStore((s) => s.setPartida);
  const setEquiposStore = useTurnoStore((s) => s.setEquipos);

  const [equipos, setEquipos] = useState(
    Array.from({ length: 5 }, (_, i) => ({
      nombre: `Equipo ${i + 1}`,
      integrantes: [],
      enabled: false,
      imagenFile: null,
    }))
  );

  const actualizarEquipo = (index, datos) => {
    setEquipos((eqs) => {
      const copia = [...eqs];
      copia[index] = { ...copia[index], ...datos };
      return copia;
    });
  };

  const handleStart = async () => {
    try {
      // 1. Crear partida en backend
      const profesorId = localStorage.getItem("userId");
      const resPartida = await fetch("http://localhost:3000/api/partidas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          codigo: crypto.randomUUID().slice(0, 6),
          profesorId: profesorId ? Number(profesorId) : undefined,
        }),
      });
      if (!resPartida.ok) throw new Error("No se pudo crear la partida");
      const partida = await resPartida.json();

      // 2. Guardar partida en el store
      setPartida(partida);

      // 3. Filtrar equipos habilitados
      const activos = equipos.filter((e) => e.enabled);
      setEquiposStore(activos);
      setSelectedTeams(activos.map((e) => e.nombre));

      // 4. Enviar cada equipo al backend
      for (const e of activos) {
        const fd = new FormData();
        fd.append("partidaId", partida.id);
        fd.append("nombre", e.nombre);
        fd.append("integrantes", e.integrantes.join(";"));
        if (e.imagenFile) {
          fd.append("avatar", e.imagenFile);
        }
        await fetch("http://localhost:3000/api/equipos", {
          method: "POST",
          body: fd,
        });
      }

      // 5. Volver a VistaCategorias (START se habilitará allí)
      navigate("/categorias");
    } catch (err) {
      console.error("Error al crear partida o equipos:", err);
      alert("No se pudo iniciar la partida. Revisa la consola.");
    }
  };

  const puedeGuardar = equipos.some((e) => e.enabled);

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col"
      style={{ backgroundImage: "url('/assets/img/Mesa.svg')" }}
    >
      <Header />

      <div className="flex-grow flex flex-col justify-center items-center text-white -translate-y-10">
        <h2 className="text-3xl mb-6">EQUIPOS</h2>

        <div className="flex flex-wrap justify-center items-center gap-6 max-w-7xl">
          {equipos.map((equipo, idx) => (
            <TarjetaEquipo
              key={idx}
              nombreInicial={equipo.nombre}
              jugadoresIniciales={equipo.integrantes}
              imagenFile={equipo.imagenFile}
              onUpdate={(datos) => actualizarEquipo(idx, datos)}
            />
          ))}
        </div>

        <button
          onClick={handleStart}
          disabled={!puedeGuardar}
          className={`mt-8 px-6 py-2 rounded-full flex items-center gap-2 transition ${
            puedeGuardar
              ? "bg-black hover:bg-gray-800 text-white"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
        >
          Guardar Equipos
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 fill-current"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      </div>
    </div>
  );
}