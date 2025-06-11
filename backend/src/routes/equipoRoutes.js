import express from 'express';
import multer from 'multer';

import {
  actualizarPuntos,
  crearEquipo,
  obtenerEquiposPorPartida,
  registrarRespuestaPartida,
  registrarRespuestaCustomizable,
} from '../controllers/equipoController.js';



const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// POST /api/equipos → recibe un solo equipo con campo 'avatar'
router.post(
  '/',
  upload.single('avatar'),
  crearEquipo
);

router.get('/', obtenerEquiposPorPartida);
router.patch('/:id/puntos', actualizarPuntos);
router.patch('/:id/respuestas-partida', registrarRespuestaPartida);
router.patch('/:id/respuestas-customizable', registrarRespuestaCustomizable);




export default router;