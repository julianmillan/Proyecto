import Usuario from '../models/Usuario.js';
import { AppError } from '../middleware/errorHandler.js';

// @desc    Obtener usuario por ID
// @route   GET /api/usuario/:id
// @access  Private
export const getUsuario = async (req, res, next) => {
  try {
    const usuario = await Usuario.findById(req.params.id);

    if (!usuario) {
      throw new AppError('Usuario no encontrado', 404);
    }

    res.json(usuario);
  } catch (error) {
    next(error);
  }
};

// @desc    Actualizar usuario
// @route   PATCH /api/usuario/:id
// @access  Private
export const actualizarUsuario = async (req, res, next) => {
  try {
    const { nombre } = req.body;

    // Verificar que el usuario actualiza su propio perfil
    if (req.params.id !== req.user.id) {
      throw new AppError('No autorizado', 403);
    }

    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id,
      { nombre },
      { new: true, runValidators: true }
    );

    if (!usuario) {
      throw new AppError('Usuario no encontrado', 404);
    }

    res.json({
      success: true,
      usuario
    });
  } catch (error) {
    next(error);
  }
};
