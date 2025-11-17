import Partido from '../models/Partido.js';
import { AppError } from '../middleware/errorHandler.js';

// @desc    Obtener todos los partidos
// @route   GET /api/partidos
// @access  Public
export const getPartidos = async (req, res, next) => {
  try {
    const partidos = await Partido.find({ estado: 'programado' })
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
