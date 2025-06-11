import express from 'express';
import multer from 'multer';
import path from 'path';
import { procesarArchivo, verPreguntas } from '../controllers/uploadController.js';

const router = express.Router();

// Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Filtro de archivos
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Formato de archivo no soportado'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Ruta principal para subir archivos
router.post('/', upload.single('archivo'), procesarArchivo);

// Ruta de test para ver preguntas almacenadas
router.get('/test', async (req, res) => {
  try {
    const preguntas = await verPreguntas();
    res.json(preguntas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener preguntas' });
  }
});

export default router;
