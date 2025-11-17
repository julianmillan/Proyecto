import mongoose from 'mongoose';

const sillaSchema = new mongoose.Schema({
  numero: {
    type: String,
    required: [true, 'El número de silla es requerido']
  },
  fila: {
    type: String,
    required: [true, 'La fila es requerida']
  },
  localidad: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Localidad',
    required: true
  },
  estado: {
    type: String,
    enum: ['disponible', 'reservada', 'vendida'],
    default: 'disponible'
  },
  partido_actual: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Partido'
  }
}, {
  timestamps: true
});

// Índice compuesto para evitar duplicados
sillaSchema.index({ numero: 1, fila: 1, localidad: 1 }, { unique: true });

export default mongoose.model('Silla', sillaSchema);
