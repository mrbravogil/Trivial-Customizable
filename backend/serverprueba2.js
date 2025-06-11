// 1º abrir vista ranking
//2º desde backend (cd backend) node serverprueba2.js

// 
//  ENDPOINT central que uso conectar la vista del front con base de datos
// CÓDIGO CONECTADO CON Padre Ranking.jsx para sacar información de la base de datos

import express from "express";
import cors from "cors";
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// ✅ AQUÍ defines la ruta correctamente
app.get("/api/grupos", async (req, res) => {
  try {
    const grupos = await prisma.grupo.findMany({
      select: {
        id: true,
        nombre: true,
        foto: true,
        puntosTotales: { //la relación que hemos creado con la base de datos de Puntuacion Grupo
            select:{
                puntosTotales: true,
            }
        }
      }
    });

      // Formatear para mandar sólo lo necesario
    const gruposFormateados = grupos.map(g => ({
      id: g.id,
      nombre: g.nombre,
      foto: g.foto,
      puntos: g.puntosTotales?.puntosTotales ?? 0,
    }));

    res.json(gruposFormateados);
  } catch (error) {
    console.error("Error al obtener grupos:", error.message);
    res.status(500).json({ error: "Error al obtener grupos" });
  }
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});