// hooks/useCategoriaStore.js
import { create } from "zustand";

export const useCategoriaStore = create((set) => ({
  categorias            : [],          // ← array vacío por defecto
  categoriaSeleccionada : null,

  setCategorias           : (cats) => set({ categorias: cats }),
  setCategoriaSeleccionada: (cat)  => set({ categoriaSeleccionada: cat }),

  /** Descarga todas las categorías del backend si aún no hay ninguna */
  cargarCategorias: async () => {
    const res  = await fetch("http://localhost:3000/api/categorias");
    const data = await res.json();
    set({ categorias: data });
  },
}));
