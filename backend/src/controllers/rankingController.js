// backend/src/controllers/rankingController.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const obtenerRanking = async (req, res) => {
  const partidaId = Number(req.query.partidaId);
  if (!partidaId) {
    return res.status(400).json({ error: 'Falta el parámetro partidaId' });
  }

  try {
    const equipos = await prisma.equipo.findMany({
      where: { partidaId },
      select: {
        id: true,
        nombre: true,
        avatarMini: true,
        puntos: true,
      },
      orderBy: { puntos: 'desc' },
    });
    res.json(equipos);
  } catch (error) {
    console.error('Error al obtener ranking:', error);
    res.status(500).json({ error: 'No se pudo obtener el ranking' });
  } finally {
    await prisma.$disconnect();
  }
};
