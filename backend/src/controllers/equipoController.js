import prisma from '../config/db.js';

export const crearEquipo = async (req, res) => {
  const avatarMini = req.file
    ? `/uploads/${req.file.filename}`
    : null;

  const { nombre, integrantes, partidaId } = req.body;

  try {
    const equipo = await prisma.equipo.create({
      data: {
        nombre,
        integrantes: Array.isArray(integrantes)
          ? integrantes.join(';')
          : integrantes,
        partidaId: Number(partidaId),
        avatarMini,
        // Prisma usará los defaults para quesitosVisitados y quesitosUnicos
      },
    });
    res.status(201).json(equipo);
  } catch (error) {
    console.error('Error al crear equipo:', error);
    res.status(500).json({ error: 'Error al crear equipo' });
  }
};

export const obtenerEquiposPorPartida = async (req, res) => {
  const { partidaId } = req.query;
  if (!partidaId) {
    return res.status(400).json({ error: 'partidaId requerido' });
  }

  try {
    const equipos = await prisma.equipo.findMany({
      where: { partidaId: Number(partidaId) },
      orderBy: { puntos: 'desc' },
      select: {
        id: true,
        nombre: true,
        integrantes: true,
        puntos: true,
        avatarMini: true,
        // Ahora sí devolvemos los campos de quesitos:
        quesitosVisitados: true,
        quesitosUnicos: true
      },
    });
    res.json(equipos);
  } catch (err) {
    console.error('Error al obtener equipos:', err);
    res.status(500).json({ error: 'Error al obtener equipos' });
  }
};

export const actualizarPuntos = async (req, res) => {
  const id = Number(req.params.id);
  const delta = Number(req.body.delta ?? 0);

  try {
    const equipoActual = await prisma.equipo.findUnique({
      where: { id },
    });
    if (!equipoActual) {
      return res.status(404).json({ error: 'Equipo no encontrado' });
    }

    const nuevosPuntos = (equipoActual.puntos || 0) + delta;
    const equipoActualizado = await prisma.equipo.update({
      where: { id },
      data: { puntos: nuevosPuntos },
    });

    res.json(equipoActualizado);
  } catch (err) {
    console.error('Error al actualizar puntos:', err);
    res.status(500).json({ error: 'No se pudieron actualizar los puntos' });
  }
};

export const registrarRespuestaPartida = async (req, res) => {
  const equipoId = Number(req.params.id);
  const { preguntaId, respuestaId, esCorrecta, puntosObtenidos } = req.body;

  if (
    !preguntaId ||
    !respuestaId ||
    esCorrecta === undefined ||
    puntosObtenidos === undefined
  ) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  try {
    const [equipo, pregunta, respuesta] = await Promise.all([
      prisma.equipo.findUnique({ where: { id: equipoId } }),
      prisma.pregunta.findUnique({ where: { id: Number(preguntaId) } }),
      prisma.respuesta.findUnique({ where: { id: Number(respuestaId) } }),
    ]);

    if (!equipo || !pregunta || !respuesta) {
      return res.status(404).json({ error: 'Equipo, pregunta o respuesta no encontrados' });
    }

    // Aquí reemplazamos create por upsert:
    await prisma.respuestaPartida.upsert({
      where: {
        equipoId_preguntaId: {
          equipoId: equipoId,
          preguntaId: Number(preguntaId),
        }
      },
      update: {
        respuestaId: Number(respuestaId),
        esCorrecta: Boolean(esCorrecta),
        puntosObtenidos: Number(puntosObtenidos),
      },
      create: {
        equipo:   { connect: { id: equipoId } },
        pregunta: { connect: { id: Number(preguntaId) } },
        respuesta: { connect: { id: Number(respuestaId) } },
        esCorrecta: Boolean(esCorrecta),
        puntosObtenidos: Number(puntosObtenidos),
      },
    });

    // Luego actualizas puntos sólo una vez con increment:
    await prisma.equipo.update({
      where: { id: equipoId },
      data: { puntos: { increment: Number(puntosObtenidos) } },
    });

    // Construyes el historial actualizado
    const historial = await prisma.respuestaPartida.findMany({
      where: { equipoId },
      orderBy: { id: 'asc' },
      include: {
        pregunta: true,
        respuesta: true,
      },
    });

    const equipoActualizado = await prisma.equipo.findUnique({
      where: { id: equipoId },
      select: { puntos: true },
    });

    return res.status(201).json({
      equipoId,
      puntosTotales: equipoActualizado.puntos,
      historial,
    });
  } catch (err) {
    console.error('Error en registrarRespuestaPartida:', err);
    return res.status(500).json({ error: 'Error al registrar respuesta de partida' });
  }
};

export const registrarRespuestaCustomizable = async (req, res) => {
  console.log('🟡 Entrando a registrarRespuestaCustomizable');
  console.log('🔢 req.params.id:', req.params.id);
  console.log('📦 req.body:', req.body);

  const equipoId     = Number(req.params.id);
  const { customizableId, esCorrecta } = req.body;

  if (!customizableId || esCorrecta === undefined) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  try {
    const [equipo, customizable] = await Promise.all([
      prisma.equipo.findUnique({ where: { id: equipoId } }),
      prisma.customizable.findUnique({ where: { id: customizableId } })
    ]);

    if (!equipo || !customizable) {
      return res.status(404).json({ error: 'Equipo o registro customizable no encontrado' });
    }

    const nuevaRespuesta = await prisma.respuestaCustomizable.create({
      data: {
        equipoId,
        customizableId,
        esCorrecta: Boolean(esCorrecta),
      },
    });

    const equipoActualizado = await prisma.equipo.findUnique({
      where: { id: equipoId },
      select: { puntos: true },
    });

    res.status(201).json({
      mensaje: 'Respuesta custom registradda correctamente',
      respuesta: nuevaRespuesta,
      puntosTotales: equipoActualizado?.puntos ?? 0,
    });
  } catch (err) {
    console.error('Error al registrar respuesta customizable:', err);
    res.status(500).json({ error: 'No se pudo registrar la respuesta' });
  }
};
