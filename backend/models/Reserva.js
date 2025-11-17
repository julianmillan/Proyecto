import mongoose from 'mongoose';

const reservaSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  partido: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Partido',
    required: true
  },
  silla: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Silla',
    required: true
  },
  fecha_reserva: {
    type: Date,
    default: Date.now
  },
  fecha_expiracion: {
    type: Date,
    required: true
  },
  estado: {
    type: String,
    enum: ['activa', 'expirada', 'confirmada', 'cancelada'],
    default: 'activa'
  },
  precio_total: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

// Índice para expirar reservas automáticamente
reservaSchema.index({ fecha_expiracion: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('Reserva', reservaSchema);
