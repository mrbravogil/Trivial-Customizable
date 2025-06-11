import prisma from '../config/db.js';

/** Devuelve todas las categorías ordenadas alfabéticamente */
export const getCategorias = async (_req, res) => {
  try {
    const cats = await prisma.categoria.findMany({
      orderBy: { nombre: 'asc' },
    });
    res.json(cats);                       // 200 OK → array de categorías
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
};
