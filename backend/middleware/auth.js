import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler.js';

// Use an indirection for jwt.verify so tests can replace it via `__setJwtVerify`
let verifyJwt = jwt.verify;
export const __setJwtVerify = (fn) => { verifyJwt = fn; };

export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new AppError('No autorizado, token no encontrado', 401);
    }

    const decoded = verifyJwt(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    // Log the original error for diagnostics and include it as cause when supported
    console.error('Protect middleware error:', error);
    // If AppError supported a cause property in the future, we could pass it.
    next(new AppError('No autorizado, token inválido', 401));
  }
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    console.log('Rol del usuario:', req.user.rol);
    console.log('Roles permitidos:', roles);
    
    if (!roles.includes(req.user.rol)) {
      return next(new AppError(`No tienes permiso para realizar esta acción. Tu rol: ${req.user.rol}, Roles requeridos: ${roles.join(', ')}`, 403));
    }
    next();
  };
};
