import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getPreguntas = async (req, res) => {
    try {
    const preguntas = await prisma.pregunta.findMany({
        include: { respuestas: true, categoria: true },
    });
    res.json(preguntas);
    } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener preguntas' });
    }
};

export const getPreguntasPorCategoria = async (req, res) => {
    const { categoria } = req.params;

    try {
        const preguntas = await prisma.pregunta.findMany({
        where: {
            categoria: {
            nombre: categoria
            }
        },
        include: {
            respuestas: true,
            categoria: true,
        },
        });

        if (preguntas.length === 0) {
        return res.status(404).json({ message: `No se encontraron preguntas para la categoría: ${categoria}` });
        }

        res.json(preguntas);
    } catch (error) {
        console.error('Error al obtener preguntas por categoría:', error);
        res.status(500).json({ error: 'Error al obtener preguntas por categoría' });
    }
    };
