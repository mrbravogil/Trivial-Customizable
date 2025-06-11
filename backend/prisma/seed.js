import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

import categorias from './data/categorias.js'; // importamos categorias.js
import preguntas from './data/preguntas.js'; // importamos preguntas.js

async function main() {

  // Insertar las categorías
  const categoriasMap = {}; // Guardamos {nombre: id} para después vincular

  for (const cat of categorias) {
    const categoria = await prisma.Categoria.create({
      data: {
        nombre: cat.nombre,
      },
    });
    categoriasMap[categoria.nombre] = categoria.id;
    console.log(`✅ Categoria creada: ${cat.nombre}`);
  }

  // Insertar las preguntas con sus respuestas
  for (const pregunta of preguntas) {
    const categoriaId = categoriasMap[pregunta.categoriaNombre];

    if (!categoriaId) {
      console.warn(`⚠️ Categoria no encontrada para la pregunta: ${pregunta.texto}`);
      continue; // Opcional: saltar si la categoría no existe
    }

    const createdPregunta = await prisma.Pregunta.create({
      data: {
        texto: pregunta.texto,
        dificultad: pregunta.dificultad, // asegúrate de que coincida con tu ENUM
        puntuacion: pregunta.puntuacion,
        categoriaId: categoriaId,
        respuestas: {
          create: pregunta.respuestas.map((respuesta) => ({
            texto: respuesta.texto,
            esCorrecta: respuesta.esCorrecta,
            explicacion: respuesta.explicacion || null,
          })),
        },
      },
    });

    console.log(`✅ Pregunta creada: ${createdPregunta.texto}`);
  }
}

main()
  .then(async () => {
    console.log('🌱 Seed completo');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
