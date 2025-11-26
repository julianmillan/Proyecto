import express from 'express';
import { getPartidos, getPartido, getDisponibilidad } from '../controllers/partido.controller.js';

const router = express.Router();

router.get('/', getPartidos);
router.get('/:id', getPartido);
router.get('/:id/disponibilidad', getDisponibilidad);

export default router;
