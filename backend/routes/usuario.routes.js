import express from 'express';
import { getUsuario, actualizarUsuario } from '../controllers/usuario.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/:id', protect, getUsuario);
router.patch('/:id', protect, actualizarUsuario);

export default router;
