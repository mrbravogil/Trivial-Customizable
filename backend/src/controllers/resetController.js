import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/**
 * Elimina TODAS las partidas, equipos, respuestas, preguntas customizables, etc.
 * NO elimina usuarios ni preguntas/respuestas predefinidas.
 */
export const resetTodoMenosUsuariosYPreguntas = async (req, res) => {
  try {
    // 1. Elimina primero las tablas hijas (dependientes)
    await prisma.respuestaCustomizable.deleteMany({});
    await prisma.respuestaPartida.deleteMany({});
    await prisma.puntuacionGrupo.deleteMany({}); // Si usas esta tabla

    // 2. Luego elimina equipos y partidas
    await prisma.equipo.deleteMany({});
    await prisma.partida.deleteMany({});

    // 3. Por último, elimina las preguntas customizables
    await prisma.customizable.deleteMany({});

    // (Opcional) Reinicia el autoincrement de Customizable si quieres
    await prisma.$executeRaw`ALTER TABLE Customizable AUTO_INCREMENT = 1`;

    res.json({ mensaje: 'Base de datos reseteada (excepto usuarios y preguntas predefinidas)' });
  } catch (error) {
    console.error('❌ Error al resetear la base de datos:', error);
    res.status(500).json({ error: 'Error al resetear la base de datos' });
  } finally {
    await prisma.$disconnect();
  }
};
