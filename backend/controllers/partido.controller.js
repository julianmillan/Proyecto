import Partido from '../models/Partido.js';
import Boleta from '../models/Boleta.js';
import Reserva from '../models/Reserva.js';
import { AppError } from '../middleware/errorHandler.js';

// @desc    Obtener todos los partidos
// @route   GET /api/partidos
// @access  Public
export const getPartidos = async (req, res, next) => {
  try {
    const partidos = await Partido.find({ estado: 'PROGRAMADO' })
      .populate('estadio')
      .sort({ fecha: 1 });

    res.json(partidos);
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener un partido por ID
// @route   GET /api/partidos/:id
// @access  Public
export const getPartido = async (req, res, next) => {
  try {
    const partido = await Partido.findById(req.params.id).populate('estadio');

    if (!partido) {
      throw new AppError('Partido no encontrado', 404);
    }

    res.json(partido);
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener disponibilidad de asientos para un partido
// @route   GET /api/partidos/:id/disponibilidad
// @access  Public
export const getDisponibilidad = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { localidad } = req.query;
    
    if (!localidad) {
      throw new AppError('Se requiere el parámetro localidad', 400);
    }
    
    // Obtener boletas y reservas activas para este partido y localidad específica
    const [boletas, reservas] = await Promise.all([
      Boleta.find({ 
        partido: id, 
        estado: 'ACTIVA' 
      }).populate({
        path: 'silla',
        populate: { path: 'localidad' }
      }),
      Reserva.find({ 
        partido: id, 
        estado: { $in: ['PENDIENTE', 'CONFIRMADA'] },
        fecha_expiracion: { $gt: new Date() }
      }).populate({
        path: 'silla',
        populate: { path: 'localidad' }
      })
    ]);
    
    // Crear mapa de asientos ocupados solo para la localidad solicitada
    const ocupados = new Set();
    
    boletas.forEach(b => {
      if (b.silla && b.silla.localidad && b.silla.localidad._id.toString() === localidad) {
        ocupados.add(`${b.silla.fila}-${b.silla.columna}`);
      }
    });
    
    reservas.forEach(r => {
      if (r.silla && r.silla.localidad && r.silla.localidad._id.toString() === localidad) {
        ocupados.add(`${r.silla.fila}-${r.silla.columna}`);
      }
    });
    
    res.json({
      partido: id,
      localidad,
      ocupados: Array.from(ocupados),
      total_ocupados: ocupados.size
    });
  } catch (error) {
    next(error);
  }
};
