import express from 'express';
import { registrarRespuesta } from '../controllers/respuestaPartidaController.js';

const router = express.Router();

router.post('/', registrarRespuesta);

export default router;
