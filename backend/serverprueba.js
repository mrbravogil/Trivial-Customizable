import express from "express"; //Framework de Node.js	para crear el servidor web y manejar rutas (endpoints).
import cors from "cors"; //Permite la conexión entre tu backend (localhost:3000) y tu frontend (React).
import mysql from "mysql2/promise"; //Cliente para conectarse a una base de datos MySQL usando promesas

const app = express(); //creación de la aplicación express
app.use(cors()); //permite de conexión 
app.use(express.json()); //permite Json



//Iniciar servidor - FUNCIÓN PRINCIPAL
async function iniciarServidor() {

  // Conexión a la base de datos MySQL
  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "trivial",
    database: "trivial_db",
  });

  // Endpoint para recibir JSON desde React (no CSV)
  app.post("/api/subir-json", async (req, res) => {//recibe un arreglo en formato JSON
    const datos = req.body; // guarda los datos para trabajar con ello posteriormente

    if (!Array.isArray(datos)) {
      return res.status(400).json({ error: "El formato debe ser un array de objetos." });
    }
//lógica para comprobar que los datos están cumplimentados
    try {
      for (const grupo of datos) {
        const { id, nombre, foto, activo, partidaId } = grupo;

        if (
          id !== undefined &&
          nombre &&
          foto &&
          activo !== undefined &&
          partidaId !== undefined
        ) {
          await db.execute(
            `INSERT INTO grupo (id, nombre, foto, activo, partidaId) 
             VALUES (?, ?, ?, ?, ?)`,
            [id, nombre, foto, activo, partidaId]
          );
        }
      }

      res.json({ mensaje: "Datos insertados correctamente en la base de datos" });
    } catch (error) {
      console.error("❌ Error al insertar en la base de datos:", error.message);
      res.status(500).json({ error: "Error al insertar en la base de datos", detalle: error.message });
    }
  });

  // Iniciar servidor
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });
}

// Ejecutar
iniciarServidor().catch((err) => {
  console.error("❌ Error al iniciar el servidor:", err);
});
