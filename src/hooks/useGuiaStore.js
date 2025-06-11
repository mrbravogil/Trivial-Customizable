import { create } from "zustand";

const useGuiaStore = create((set) => ({
  guiaAbierta: false,
  abrirGuia: () => set({ guiaAbierta: true }),
  cerrarGuia: () => set({ guiaAbierta: false }),
  toggleGuia: () =>
    set((state) => ({ guiaAbierta: !state.guiaAbierta })),
}));

export default useGuiaStore;
