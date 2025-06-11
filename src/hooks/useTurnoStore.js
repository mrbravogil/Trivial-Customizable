import { create } from "zustand";

export const useTurnoStore = create((set, get) => ({
  equipos: [],            // cada equipo debe tener { id, nombre, puntos, quesitosVisitados: [], quesitosUnicos: 0, … }
  turnoActual: 0,
  historialRespuestas: {},

  setEquipos: (eqs) => {
    console.log("[store] setEquipos:", eqs);
    set(() => ({ equipos: eqs, turnoActual: 0 }));
  },

  // -----------------------------
  // Función para actualizar quesitos en el store local
  // -----------------------------
  actualizarQuesitosEquipo: (equipoId, nuevosVisitados, nuevosUnicos) => {
    set((state) => {
      const nuevosEquipos = state.equipos.map((eq) =>
        eq.id === equipoId
          ? { ...eq, quesitosVisitados: nuevosVisitados, quesitosUnicos: nuevosUnicos }
          : eq
      );
      return { equipos: nuevosEquipos };
    });
  },

  actualizarEquipos: (eqs) => {
    console.log("[store] actualizarEquipos:", eqs);
    set(() => ({ equipos: eqs }));
  },

  addPuntos: (id, delta) => {
    console.log(`[store] addPuntos → id=${id}, delta=${delta}`);
    set((state) => {
      const nuevos = state.equipos.map((e) =>
        e.id === id ? { ...e, puntos: e.puntos + delta } : e
      );
      console.log("[store] equipos tras addPuntos:", nuevos);
      return { equipos: nuevos };
    });
  },

  syncPuntos: async (id, delta) => {
    console.log(`[store] syncPuntos → id=${id}, delta=${delta}`);
    const res = await fetch(`http://localhost:3000/api/equipos/${id}/puntos`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ delta }),
    });
    if (!res.ok) throw new Error("Error al sincronizar puntos");
    const json = await res.json();
    console.log("[store] syncPuntos response:", json);
    return json;
  },

  registrarRespuesta: async (idEquipo, respuestaData) => {
    // Actualiza el store localmente para reflejar respuesta inmediata
    set((state) => {
      const historialActual = state.historialRespuestas[idEquipo] || [];
      const nuevoHistorial = {
        ...state.historialRespuestas,
        [idEquipo]: [...historialActual, respuestaData],
      };
      return { historialRespuestas: nuevoHistorial };
    });

    try {
      const res = await fetch(
        `http://localhost:3000/api/equipos/${idEquipo}/respuestas-partida`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(respuestaData),
        }
      );

      if (!res.ok) throw new Error("Error al guardar respuesta en el backend");

      const json = await res.json();
      console.log("[store] Respuesta registrada correctamente:", json);

      // Actualizar puntos desde backend
      set((state) => {
        const nuevosEquipos = state.equipos.map((e) =>
          e.id === idEquipo ? { ...e, puntos: json.puntosTotales } : e
        );
        return { equipos: nuevosEquipos };
      });

      return json;
    } catch (error) {
      console.error("[store] Error al registrar respuesta en el backend:", error);
    }
  },

  registrarRespuestaCustomizable: async (idEquipo, respuestaData) => {
    // Actualiza el store localmente para reflejar respuesta inmediata
    set((state) => {
      const historialActual = state.historialRespuestas[idEquipo] || [];
      const nuevoHistorial = {
        ...state.historialRespuestas,
        [idEquipo]: [...historialActual, respuestaData],
      };
      return { historialRespuestas: nuevoHistorial };
    });

    try {
      const res = await fetch(
        `http://localhost:3000/api/equipos/${idEquipo}/respuestas-customizable`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(respuestaData),
        }
      );

      if (!res.ok) throw new Error("Error al guardar respuesta customizable en el backend");

      const json = await res.json();
      console.log("[store] Respuesta customizable registrada correctamente:", json);

      // Actualizar puntos desde backend si aplica
      set((state) => {
        const nuevosEquipos = state.equipos.map((e) =>
          e.id === idEquipo ? { ...e, puntos: json.puntosTotales } : e
        );
        return { equipos: nuevosEquipos };
      });

      return json;
    } catch (error) {
      console.error("[store] Error al registrar respuesta customizable en el backend:", error);
    }
  },

  avanzarTurno: () => {
    set((state) => {
      const next = (state.turnoActual + 1) % state.equipos.length;
      console.log("[store] avanzarTurno → turnoActual =", next);
      return { turnoActual: next };
    });
  }
}));