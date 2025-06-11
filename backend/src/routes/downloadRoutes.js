import express from 'express';
import { downloadResultadoExcel } from '../controllers/downloadController.js';

const router = express.Router(); //Maneja la ruta

router.get('/download-grupos', downloadResultadoExcel);
//al acceder a la ruta download-grupos, se ejecuta la función downloadResultadoExcel

export default router; // lo que exportamos
