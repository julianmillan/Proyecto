import express from 'express';
import { getPartidos, getPartido } from '../controllers/partido.controller.js';

const router = express.Router();

router.get('/', getPartidos);
router.get('/:id', getPartido);

export default router;
