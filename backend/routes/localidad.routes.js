import express from 'express';
import { getLocalidadesPorEstadio } from '../controllers/localidad.controller.js';

const router = express.Router();

router.get('/', getLocalidadesPorEstadio);

export default router;
