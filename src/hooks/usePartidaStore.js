import { create } from "zustand";

export const usePartidaStore = create((set) => ({
  partidaId: null,
  codigoPartida: null,
  setPartida: ({ id, codigo }) =>
    set({ partidaId: id, codigoPartida: codigo }),
}));