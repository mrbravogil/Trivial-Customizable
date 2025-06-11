import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const registrarRespuesta = async (req, res) => {
    console.log('📩 Se recibió una solicitud POST con:', req.body);
    try {
        const { equipoId, preguntaId, respuestaId, esCorrecta, puntosObtenidos } = req.body;

        // Validar que todos los datos estén presentes (opcional pero recomendado)
        if (
            equipoId === undefined ||
            preguntaId === undefined ||
            respuestaId === undefined ||
            esCorrecta === undefined ||
            puntosObtenidos === undefined
        ) {
            return res.status(400).json({ error: 'Faltan datos para registrar la respuesta' });
        }

        // Crear el registro en la tabla RespuestaPartida
        const nuevoRegistro = await prisma.respuestaPartida.create({
            data: {
                equipoId,
                preguntaId,
                respuestaId,
                esCorrecta,
                puntosObtenidos,
            },
        });

        return res.status(201).json({ mensaje: 'Respuesta registrada', data: nuevoRegistro });

    } catch (error) {
        console.error('Error al registrar respuesta:', error);
        return res.status(500).json({ error: 'Error al registrar respuesta' });
    }
};
