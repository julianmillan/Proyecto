import Partido from '../models/Partido.js';
import Estadio from '../models/Estadio.js';
import Localidad from '../models/Localidad.js';
import Usuario from '../models/Usuario.js';
import Boleta from '../models/Boleta.js';
import { AppError } from '../middleware/errorHandler.js';

// @desc    Obtener todos los usuarios
// @route   GET /api/admin/usuarios
// @access  Private/Admin
export const getUsuarios = async (req, res, next) => {
  try {
    const usuarios = await Usuario.find().select('-contraseña').sort({ fecha_registro: -1 });
    res.json(usuarios);
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener todos los partidos (admin)
// @route   GET /api/admin/partidos
// @access  Private/Admin
export const getPartidosAdmin = async (req, res, next) => {
  try {
    const partidos = await Partido.find().populate('estadio').sort({ fecha: -1 });
    res.json(partidos);
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener todas las boletas (admin)
// @route   GET /api/admin/boletas
// @access  Private/Admin
export const getBoletasAdmin = async (req, res, next) => {
  try {
    const boletas = await Boleta.find()
      .populate('usuario', 'nombre email')
      .populate('partido', 'equipo_local equipo_visitante fecha')
      .sort({ fecha_compra: -1 });
    res.json(boletas);
  } catch (error) {
    next(error);
  }
};

// @desc    Crear nuevo partido
// @route   POST /api/admin/partidos
// @access  Private/Admin
export const crearPartido = async (req, res, next) => {
  try {
    const { 
      equipo_local, 
      equipo_visitante, 
      fecha, 
      hora, 
      estadio, 
      precio_base,
      imagen,
      descripcion 
    } = req.body;

    const partido = await Partido.create({
      equipo_local,
      equipo_visitante,
      fecha,
      hora,
      estadio,
      precio_base,
      imagen,
      descripcion
    });

    res.status(201).json({
      success: true,
      partido
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Actualizar partido
// @route   PATCH /api/admin/partidos/:id
// @access  Private/Admin
export const actualizarPartido = async (req, res, next) => {
  try {
    const partido = await Partido.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!partido) {
      throw new AppError('Partido no encontrado', 404);
    }

    res.json({
      success: true,
      partido
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Eliminar partido
// @route   DELETE /api/admin/partidos/:id
// @access  Private/Admin
export const eliminarPartido = async (req, res, next) => {
  try {
    const partido = await Partido.findByIdAndDelete(req.params.id);

    if (!partido) {
      throw new AppError('Partido no encontrado', 404);
    }

    res.json({
      success: true,
      message: 'Partido eliminado'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Crear estadio
// @route   POST /api/admin/estadios
// @access  Private/Admin
export const crearEstadio = async (req, res, next) => {
  try {
    const estadio = await Estadio.create(req.body);

    res.status(201).json({
      success: true,
      estadio
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Crear localidad
// @route   POST /api/admin/localidades
// @access  Private/Admin
export const crearLocalidad = async (req, res, next) => {
  try {
    const localidad = await Localidad.create(req.body);

    res.status(201).json({
      success: true,
      localidad
    });
  } catch (error) {
    next(error);
  }
};
