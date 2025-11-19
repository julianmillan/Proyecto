import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';
import { AppError } from '../middleware/errorHandler.js';

// Generar JWT
const generateToken = (id, rol) => {
  return jwt.sign({ id, rol }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d'
  });
};

// @desc    Registrar nuevo usuario
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { nombre, email, contraseña } = req.body;

    // Verificar si el usuario ya existe
    const existeUsuario = await Usuario.findOne({ email });
    if (existeUsuario) {
      throw new AppError('El email ya está registrado', 400);
    }

    // Crear usuario
    const usuario = await Usuario.create({
      nombre,
      email,
      contraseña
    });

    // Generar token
    const token = generateToken(usuario._id, usuario.rol);

    res.status(201).json({
      success: true,
      token,
      usuario: {
        _id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login de usuario
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, contraseña } = req.body;

    // Validar datos
    if (!email || !contraseña) {
      throw new AppError('Por favor ingresa email y contraseña', 400);
    }

    // Buscar usuario con contraseña
    const usuario = await Usuario.findOne({ email }).select('+contraseña');
    
    if (!usuario || !(await usuario.compararContraseña(contraseña))) {
      throw new AppError('Credenciales inválidas', 401);
    }

    // Generar token
    const token = generateToken(usuario._id, usuario.rol);

    res.json({
      success: true,
      token,
      usuario: {
        _id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener usuario actual
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const usuario = await Usuario.findById(req.user.id);
    
    if (!usuario) {
      throw new AppError('Usuario no encontrado', 404);
    }

    res.json({
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      fecha_registro: usuario.fecha_registro
    });
  } catch (error) {
    next(error);
  }
};
