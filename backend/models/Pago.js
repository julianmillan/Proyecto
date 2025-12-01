import mongoose from 'mongoose';

const pagoSchema = new mongoose.Schema({
  boleta: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Boleta'
  },
  monto: {
    type: Number,
    required: [true, 'El monto es requerido']
  },
  metodo_pago: {
    type: String,
    enum: ['TARJETA', 'NEQUI', 'PSE'],
    required: true
  },
  estado: {
    type: String,
    enum: ['EXITOSO', 'FALLIDO', 'PENDIENTE'],
    default: 'PENDIENTE'
  },
  fecha_pago: {
    type: Date,
    default: Date.now
  },
  referencia_pago: {
    type: String
  },
  detalles: {
    type: Object
  }
}, {
  timestamps: true
});

export default mongoose.model('Pago', pagoSchema);
