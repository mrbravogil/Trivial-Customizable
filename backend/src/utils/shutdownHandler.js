// Este archivo se encarga de borrar preguntas de la base de datos una vez subidas

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient(); //Crea una instancia del cliente Prisma para que se puedan ejecutar consultas en la base de datos.

async function eliminarPreguntasCustomizables() {//Se usa una función asyn porque debe esprar a que se borren las preguntas de la BD antes de seguir ejecutando lo demás. 
  try {
    await prisma.customizable.deleteMany({
      where: { customizable: true }, //Utiliza Prisma para eliminar todos los registros de la tabla customizable que tengan el campo customizable: true.
    });
    console.log('🧹 Preguntas personalizadas eliminadas correctamente.');
  } catch (err) {
    console.error('❌ Error al eliminar preguntas personalizadas:', err);
  } finally {
    await prisma.$disconnect(); //Cierra la conexión con la base de datos.
  }
}

//Manejo de eventos del sistema (cierre del servidor)
export function configurarEventosDeCierre() { //Exporta una función que, al ejecutarse, escucha los eventos de cierre del proceso (por ejemplo, cuando se pulsa Ctrl+C o el sistema mata el proceso).
  process.on('SIGINT', async () => { //Cuando el proceso recibe la señal SIGINT(es una señal)(Ctrl+C), borra las preguntas personalizadas y luego detiene el proceso.
    console.log('\n🛑 Cerrando servidor (Ctrl+C)...');
    await eliminarPreguntasCustomizables(); 
    process.exit(0);
  });

  process.on('SIGTERM', async () => { //Lo mismo pero para SIGTERM, otra señal para finalizar procesos.
    console.log('\n🛑 Servidor finalizado (SIGTERM)...');
    await eliminarPreguntasCustomizables();
    process.exit(0);
  });

  process.on('exit', async () => { //Cuando el proceso termina por cualquier motivo (salida natural), también se eliminan las preguntas.
    console.log('\n🔚 Proceso finalizado.');
    await eliminarPreguntasCustomizables();
  });
}
