import express from 'express';
import { 
  crearReserva, 
  comprarBoleta, 
  getHistorial, 
  cancelarBoleta 
} from '../controllers/reserva.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/reservar', protect, crearReserva);
router.post('/comprar', protect, comprarBoleta);
router.get('/historial', protect, getHistorial);
router.patch('/cancelar/:id', protect, cancelarBoleta);

export default router;
