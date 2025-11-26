import express from 'express';
import { 
  crearPartido, 
  actualizarPartido, 
  eliminarPartido,
  crearEstadio,
  crearLocalidad,
  getUsuarios,
  getPartidosAdmin,
  getBoletasAdmin,
  simularPartido,
  cancelarPartido,
  getReporteVentas,
  getHistorialPartidos,
  finalizarPartido
} from '../controllers/admin.controller.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Proteger todas las rutas de admin
router.use(protect);
router.use(restrictTo('ADMIN'));

// Consultas
router.get('/usuarios', getUsuarios);
router.get('/partidos', getPartidosAdmin);
router.get('/boletas', getBoletasAdmin);
router.get('/historial-partidos', getHistorialPartidos);

// Reportes
router.get('/reportes/ventas', getReporteVentas);

// Partidos
router.post('/partidos', crearPartido);
router.patch('/partidos/:id', actualizarPartido);
router.delete('/partidos/:id', eliminarPartido);
router.post('/partidos/:id/simular', simularPartido);
router.patch('/partidos/:id/cancelar', cancelarPartido);
router.patch('/partidos/:id/finalizar', finalizarPartido);

// Estadios y localidades
router.post('/estadios', crearEstadio);
router.post('/localidades', crearLocalidad);

export default router;
