import prisma from '../config/db.js';

export const crearPartida = async (req, res) => {
  const { codigo, estado = 'EN_CURSO' } = req.body;           // ← valor opcional

  try {
    const nueva = await prisma.partida.create({
      data: { codigo, estado },                               // ← OK con el nuevo campo
    });
    res.status(201).json(nueva);
  } catch (error) {
    console.error('Error al crear partida:', error);
    res.status(500).json({ error: 'Error al crear partida' });
  }
};