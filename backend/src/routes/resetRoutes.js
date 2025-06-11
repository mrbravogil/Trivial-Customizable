import express from 'express';
import { resetTodoMenosUsuariosYPreguntas } from '../controllers/resetController.js';

const router = express.Router();

// Nueva ruta para resetear todo menos usuarios y preguntas/respuestas predefinidas
router.delete('/todo', resetTodoMenosUsuariosYPreguntas);

export default router;
