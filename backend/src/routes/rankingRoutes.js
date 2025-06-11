import express from "express";
import { obtenerRanking } from "../controllers/rankingController.js";


const router = express.Router();

// Ruta para obtener los grupos
router.get("/grupos", obtenerRanking);

export default router;