import Localidad from '../models/Localidad.js';
import { AppError } from '../middleware/errorHandler.js';

// @desc    Obtener localidades por estadio
// @route   GET /api/localidades?estadio=:id
// @access  Public
export const getLocalidadesPorEstadio = async (req, res, next) => {
  try {
    const { estadio } = req.query;
    
    console.log('Buscando localidades para estadio:', estadio);
    
    if (!estadio) {
      throw new AppError('Se requiere el ID del estadio', 400);
    }
    
    // Primero verificar cuántas localidades hay en total
    const totalLocalidades = await Localidad.countDocuments();
    console.log('Total de localidades en BD:', totalLocalidades);
    
    // Buscar localidades para este estadio
    const localidades = await Localidad.find({ estadio })
      .populate('estadio')
      .sort({ nombre: 1 });
    
    console.log('Localidades encontradas:', localidades.length);
    
    if (localidades.length === 0) {
      // Si no encuentra, listar todas las localidades para debug
      const todasLocalidades = await Localidad.find().populate('estadio').limit(5);
      console.log('Primeras 5 localidades en BD:', todasLocalidades.map(l => ({
        nombre: l.nombre,
        estadioId: l.estadio?._id,
        estadioNombre: l.estadio?.nombre
      })));
    }
    
    res.json(localidades);
  } catch (error) {
    console.error('Error en getLocalidadesPorEstadio:', error);
    next(error);
  }
};
