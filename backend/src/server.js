import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import multer from 'multer'; // para el handler de errores
import path from 'path';
import { fileURLToPath } from 'url'; // para reconstruir __dirname
import authRoutes from './routes/authRoutes.js';
import categoriaRoutes from './routes/categoriaRoutes.js';
import downloadRoutes from './routes/downloadRoutes.js';
import equipoRoutes from './routes/equipoRoutes.js';
import partidaRoutes from './routes/partidaRoutes.js';
import preguntasRoutes from './routes/preguntas.routes.js';
import rankingRoutes from './routes/rankingRoutes.js';
import resetRoutes from './routes/resetRoutes.js'; // si aún lo necesitas
import uploadRoutes from './routes/uploadRoutes.js';
import { configurarEventosDeCierre } from './utils/shutdownHandler.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

// Reconstruir __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// Servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use(express.static(path.join(__dirname, '../public')));

// Configurar CORS antes de las rutas
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// JSON body parser
app.use(express.json());

// Sirve la carpeta 'public' (para imágenes, audio, etc.)
app.use(express.static(path.join(process.cwd(), 'public')));

// Montar rutas API
app.use('/api/auth',      authRoutes);
app.use('/api/partidas',  partidaRoutes);
app.use('/api/equipos',   equipoRoutes);
app.use('/api/preguntas', preguntasRoutes);
app.use('/api/categorias',categoriaRoutes);

app.use('/api/upload',    uploadRoutes);    // subida de CSV/XLSX
app.use('/api/ranking',   rankingRoutes);
app.use('/api',  downloadRoutes);
app.use('/api/reset',     resetRoutes);     // si lo sigues usando

// Handler de errores de multer (subida de archivos)
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      error: 'Error al subir archivo',
      details: err.message,
    });
  }
  next(err);
});

// Ruta raíz de prueba
app.get('/', (req, res) => {
  res.send('Servidor backend funcionando 🚀');
});

// Configurar cierre limpio
configurarEventosDeCierre();

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend escuchando en http://localhost:${PORT}`);
});
