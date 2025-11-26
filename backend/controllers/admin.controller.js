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

// @desc    Simular partido (generar resultado aleatorio)
// @route   POST /api/admin/partidos/:id/simular
// @access  Private/Admin
export const simularPartido = async (req, res, next) => {
  try {
    const partido = await Partido.findById(req.params.id);

    if (!partido) {
      throw new AppError('Partido no encontrado', 404);
    }

    if (partido.estado === 'FINALIZADO' || partido.estado === 'SIMULADO') {
      throw new AppError('El partido ya ha sido finalizado o simulado', 400);
    }

    // Generar resultados aleatorios
    const golesLocal = Math.floor(Math.random() * 5);
    const golesVisitante = Math.floor(Math.random() * 5);
    
    // Generar posesión (suma debe ser 100%)
    const posesionLocal = Math.floor(Math.random() * 41) + 30; // 30-70%
    const posesionVisitante = 100 - posesionLocal;
    
    // Generar tarjetas y tiros
    const tarjetasAmarillasLocal = Math.floor(Math.random() * 6);
    const tarjetasAmarillasVisitante = Math.floor(Math.random() * 6);
    const tarjetasRojasLocal = Math.random() < 0.2 ? Math.floor(Math.random() * 2) : 0;
    const tarjetasRojasVisitante = Math.random() < 0.2 ? Math.floor(Math.random() * 2) : 0;
    const tirosArcoLocal = Math.floor(Math.random() * 15) + 5;
    const tirosArcoVisitante = Math.floor(Math.random() * 15) + 5;

    // Calcular asistencia (boletas vendidas)
    const boletasVendidas = await Boleta.countDocuments({ 
      partido: partido._id,
      estado: { $in: ['ACTIVA', 'USADA'] }
    });

    partido.simulado = true;
    partido.estado = 'SIMULADO';
    partido.resultado = {
      goles_local: golesLocal,
      goles_visitante: golesVisitante
    };
    partido.estadisticas = {
      posesion_local: posesionLocal,
      posesion_visitante: posesionVisitante,
      tarjetas_amarillas_local: tarjetasAmarillasLocal,
      tarjetas_amarillas_visitante: tarjetasAmarillasVisitante,
      tarjetas_rojas_local: tarjetasRojasLocal,
      tarjetas_rojas_visitante: tarjetasRojasVisitante,
      tiros_arco_local: tirosArcoLocal,
      tiros_arco_visitante: tirosArcoVisitante
    };
    partido.asistencia_real = boletasVendidas;

    await partido.save();

    res.json({
      success: true,
      partido,
      mensaje: `Partido simulado: ${partido.equipo_local} ${golesLocal} - ${golesVisitante} ${partido.equipo_visitante}`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancelar partido
// @route   PATCH /api/admin/partidos/:id/cancelar
// @access  Private/Admin
export const cancelarPartido = async (req, res, next) => {
  try {
    const partido = await Partido.findById(req.params.id);

    if (!partido) {
      throw new AppError('Partido no encontrado', 404);
    }

    if (partido.estado !== 'PROGRAMADO') {
      throw new AppError('Solo se pueden cancelar partidos programados', 400);
    }

    partido.estado = 'CANCELADO';
    await partido.save();

    // Cancelar todas las boletas asociadas
    await Boleta.updateMany(
      { partido: partido._id, estado: 'ACTIVA' },
      { estado: 'CANCELADA' }
    );

    res.json({
      success: true,
      mensaje: 'Partido cancelado y boletas reembolsadas'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener reportes de ventas
// @route   GET /api/admin/reportes/ventas
// @access  Private/Admin
export const getReporteVentas = async (req, res, next) => {
  try {
    // Total de boletas vendidas
    const totalBoletas = await Boleta.countDocuments({ estado: { $in: ['ACTIVA', 'USADA'] } });
    
    // Ingresos totales
    const ingresosTotales = await Boleta.aggregate([
      { $match: { estado: { $in: ['ACTIVA', 'USADA'] } } },
      { $group: { _id: null, total: { $sum: '$precio_total' } } }
    ]);

    // Ventas por partido
    const ventasPorPartido = await Boleta.aggregate([
      { $match: { estado: { $in: ['ACTIVA', 'USADA'] } } },
      {
        $group: {
          _id: '$partido',
          cantidad: { $count: {} },
          ingresos: { $sum: '$precio_total' }
        }
      },
      {
        $lookup: {
          from: 'partidos',
          localField: '_id',
          foreignField: '_id',
          as: 'partidoInfo'
        }
      },
      { $unwind: '$partidoInfo' },
      { $sort: { ingresos: -1 } },
      { $limit: 10 }
    ]);

    // Ventas por localidad
    const ventasPorLocalidad = await Boleta.aggregate([
      { $match: { estado: { $in: ['ACTIVA', 'USADA'] } } },
      {
        $lookup: {
          from: 'sillas',
          localField: 'silla',
          foreignField: '_id',
          as: 'sillaInfo'
        }
      },
      { $unwind: '$sillaInfo' },
      {
        $lookup: {
          from: 'localidads',
          localField: 'sillaInfo.localidad',
          foreignField: '_id',
          as: 'localidadInfo'
        }
      },
      { $unwind: '$localidadInfo' },
      {
        $group: {
          _id: '$localidadInfo.nombre',
          cantidad: { $count: {} },
          ingresos: { $sum: '$precio_total' }
        }
      },
      { $sort: { ingresos: -1 } }
    ]);

    res.json({
      success: true,
      reporte: {
        totalBoletas,
        ingresosTotales: ingresosTotales[0]?.total || 0,
        ventasPorPartido,
        ventasPorLocalidad
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener historial de partidos (jugados y simulados)
// @route   GET /api/admin/historial-partidos
// @access  Private/Admin
export const getHistorialPartidos = async (req, res, next) => {
  try {
    const partidos = await Partido.find({ estado: { $in: ['SIMULADO', 'FINALIZADO'] } })
      .populate('estadio')
      .sort({ fecha: -1 });

    res.json({
      success: true,
      partidos
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Finalizar partido manualmente (partido real jugado)
// @route   PATCH /api/admin/partidos/:id/finalizar
// @access  Private/Admin
export const finalizarPartido = async (req, res, next) => {
  try {
    const partido = await Partido.findById(req.params.id);

    if (!partido) {
      throw new AppError('Partido no encontrado', 404);
    }

    if (partido.estado !== 'PROGRAMADO' && partido.estado !== 'SIMULADO') {
      throw new AppError('Solo se pueden finalizar partidos programados o simulados', 400);
    }

    const { goles_local, goles_visitante, estadisticas } = req.body;

    // Calcular asistencia real (boletas vendidas)
    const boletasVendidas = await Boleta.countDocuments({ 
      partido: partido._id,
      estado: { $in: ['ACTIVA', 'USADA'] }
    });

    partido.simulado = false;
    partido.estado = 'FINALIZADO';
    partido.resultado = {
      goles_local: goles_local || 0,
      goles_visitante: goles_visitante || 0
    };
    
    if (estadisticas) {
      partido.estadisticas = estadisticas;
    }
    
    partido.asistencia_real = boletasVendidas;

    await partido.save();

    res.json({
      success: true,
      partido,
      mensaje: `Partido finalizado: ${partido.equipo_local} ${goles_local || 0} - ${goles_visitante || 0} ${partido.equipo_visitante}`
    });
  } catch (error) {
    next(error);
  }
};
