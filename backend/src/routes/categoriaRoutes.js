import express from 'express';
import { getCategorias } from '../controllers/categoriaController.js';

const router = express.Router();

router.get('/', getCategorias);          // /api/categorias

export default router;
