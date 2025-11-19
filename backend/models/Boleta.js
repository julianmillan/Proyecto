import mongoose from 'mongoose';

const boletaSchema = new mongoose.Schema({
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
  precio_total: {
    type: Number,
    required: true
  },
  estado: {
    type: String,
    enum: ['ACTIVA', 'USADA', 'CANCELADA'],
    default: 'ACTIVA'
  },
  codigo_qr: {
    type: String,
    required: true,
    unique: true
  },
  fecha_compra: {
    type: Date,
    default: Date.now
  },
  pago: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pago'
  }
}, {
  timestamps: true
});

// Generar código QR único
boletaSchema.pre('save', function(next) {
  if (!this.codigo_qr) {
    this.codigo_qr = `QR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  next();
});

export default mongoose.model('Boleta', boletaSchema);
