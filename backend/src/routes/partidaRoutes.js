import express from 'express';
import { crearPartida } from '../controllers/partidaController.js';

const router = express.Router();

router.post('/', crearPartida);

export default router;