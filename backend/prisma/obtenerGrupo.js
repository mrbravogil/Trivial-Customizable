//DOCUMENTO LETICIA sacar por pantalla los datos de la base de datos al hacer node prisma/obtenerGrupo.js

import { PrismaClient } from '@prisma/client'; //conexión con la base de datos

const prisma = new PrismaClient(); //inicializa Prisma para realizar consultas

async function obtenerGrupo() {
    try {
        const grupo = await prisma.grupo.findMany(); // obtiene todos los registros
        console.log(grupo);

    } catch (error) {
        console.error('Error al obtener usuarios:', error);

    } finally {
        await prisma.$disconnect(); //cierra la conexión = recomendado

    }
}

obtenerGrupo()
