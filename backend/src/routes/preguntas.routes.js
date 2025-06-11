import express from 'express';
import { getPreguntas, getPreguntasPorCategoria } from '../controllers/preguntas.controller.js';

const router = express.Router();

router.get('/', getPreguntas);
router.get('/:categoria', getPreguntasPorCategoria);


export default router;
