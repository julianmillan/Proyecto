import Reserva from '../models/Reserva.js';
import Boleta from '../models/Boleta.js';
import Silla from '../models/Silla.js';
import Pago from '../models/Pago.js';
import Localidad from '../models/Localidad.js';
import { AppError } from '../middleware/errorHandler.js';

// @desc    Crear una reserva (15 minutos)
// @route   POST /api/reservar
// @access  Private
export const crearReserva = async (req, res, next) => {
  try {
    const { partido, zona, fila, numero } = req.body;

    // Buscar localidad por nombre
    const localidad = await Localidad.findOne({ nombre: zona });
    if (!localidad) {
      throw new AppError('Localidad no encontrada', 404);
    }

    // Buscar o crear silla
    let silla = await Silla.findOne({ 
      numero, 
      fila, 
      localidad: localidad._id 
    });

    if (!silla) {
      silla = await Silla.create({
        numero,
        fila,
        localidad: localidad._id,
        estado: 'disponible'
      });
    }

    // Verificar disponibilidad
    if (silla.estado !== 'disponible') {
      throw new AppError('La silla no está disponible', 400);
    }

    // Calcular fecha de expiración (15 minutos)
    const fechaExpiracion = new Date(Date.now() + 15 * 60 * 1000);

    // Crear reserva
    const reserva = await Reserva.create({
      usuario: req.user.id,
      partido,
      silla: silla._id,
      fecha_expiracion: fechaExpiracion,
      precio_total: localidad.precio_base
    });

    // Actualizar estado de la silla
    silla.estado = 'reservada';
    silla.partido_actual = partido;
    await silla.save();

    res.status(201).json({
      success: true,
      reserva: await reserva.populate(['partido', 'silla'])
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Comprar boleta directamente
// @route   POST /api/comprar
// @access  Private
export const comprarBoleta = async (req, res, next) => {
  try {
    const { partido, zona, fila, numero, metodo_pago } = req.body;

    // Buscar localidad
    const localidad = await Localidad.findOne({ nombre: zona });
    if (!localidad) {
      throw new AppError('Localidad no encontrada', 404);
    }

    // Buscar o crear silla
    let silla = await Silla.findOne({ 
      numero, 
      fila, 
      localidad: localidad._id 
    });

    if (!silla) {
      silla = await Silla.create({
        numero,
        fila,
        localidad: localidad._id,
        estado: 'disponible'
      });
    }

    // Verificar disponibilidad
    if (silla.estado !== 'disponible') {
      throw new AppError('La silla no está disponible', 400);
    }

    // Crear pago
    const pago = await Pago.create({
      usuario: req.user.id,
      monto: localidad.precio_base,
      metodo_pago,
      estado: 'completado',
      referencia_pago: `REF-${Date.now()}`
    });

    // Crear boleta
    const boleta = await Boleta.create({
      usuario: req.user.id,
      partido,
      silla: silla._id,
      precio_total: localidad.precio_base,
      pago: pago._id,
      codigo_qr: `QR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    });

    // Actualizar silla
    silla.estado = 'vendida';
    silla.partido_actual = partido;
    await silla.save();

    // Actualizar referencia de pago
    pago.boleta = boleta._id;
    await pago.save();

    res.status(201).json({
      success: true,
      boleta: await boleta.populate(['partido', 'silla', 'pago'])
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener historial de boletas
// @route   GET /api/historial
// @access  Private
export const getHistorial = async (req, res, next) => {
  try {
    const boletas = await Boleta.find({ usuario: req.user.id })
      .populate({
        path: 'partido',
        populate: { path: 'estadio' }
      })
      .populate({
        path: 'silla',
        populate: { path: 'localidad' }
      })
      .sort({ fecha_compra: -1 });

    res.json(boletas);
  } catch (error) {
    next(error);
  }
};

// @desc    Cancelar boleta
// @route   PATCH /api/cancelar/:id
// @access  Private
export const cancelarBoleta = async (req, res, next) => {
  try {
    const boleta = await Boleta.findById(req.params.id);

    if (!boleta) {
      throw new AppError('Boleta no encontrada', 404);
    }

    // Verificar que la boleta pertenece al usuario
    if (boleta.usuario.toString() !== req.user.id) {
      throw new AppError('No autorizado', 403);
    }

    // Verificar que la boleta esté activa
    if (boleta.estado !== 'activa') {
      throw new AppError('La boleta no puede ser cancelada', 400);
    }

    // Actualizar boleta
    boleta.estado = 'cancelada';
    await boleta.save();

    // Liberar silla
    const silla = await Silla.findById(boleta.silla);
    if (silla) {
      silla.estado = 'disponible';
      silla.partido_actual = null;
      await silla.save();
    }

    res.json({
      success: true,
      message: 'Boleta cancelada exitosamente'
    });
  } catch (error) {
    next(error);
  }
};
