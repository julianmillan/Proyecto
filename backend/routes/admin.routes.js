import express from 'express';
import { 
  crearPartido, 
  actualizarPartido, 
  eliminarPartido,
  crearEstadio,
  crearLocalidad
} from '../controllers/admin.controller.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Proteger todas las rutas de admin
router.use(protect);
router.use(restrictTo('admin'));

// Partidos
router.post('/partidos', crearPartido);
router.patch('/partidos/:id', actualizarPartido);
router.delete('/partidos/:id', eliminarPartido);

// Estadios y localidades
router.post('/estadios', crearEstadio);
router.post('/localidades', crearLocalidad);

export default router;
