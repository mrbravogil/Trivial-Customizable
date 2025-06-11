

// -- DOCUMENTO LETICIA- FORMA DE DESCARGAR DATOS A UN JSON. NO NECESARIO--
//descargarlos haciendo node prisma/descargarGrupo.js


import { PrismaClient } from '@prisma/client';
import fs from 'fs'; // 

const prisma = new PrismaClient(); //instancia para hacer consultas

async function exportData() {
  const grupo = await prisma.grupo.findMany(); //obtiene todos los registros de la tabla
  fs.writeFileSync('productos.json', JSON.stringify(grupo, null, 2)); //lo convierte en Json y los guarda
  console.log('Datos exportados a productos.json');
}

exportData()
  .catch(e => console.error(e)) //ejecuta la función o muestra el error
  .finally(() => prisma.$disconnect()); //cierra conexión
