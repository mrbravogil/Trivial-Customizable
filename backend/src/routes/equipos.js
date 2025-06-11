import express from 'express';
import { crearEquipo, obtenerEquiposPorPartida, actualizarPuntos } from '../controllers/equipoController.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();

router.post('/equipos', upload.single('avatarMini'), crearEquipo);
router.get('/equipos', obtenerEquiposPorPartida);
router.patch('/equipos/:id/puntos', actualizarPuntos);

export default router;
