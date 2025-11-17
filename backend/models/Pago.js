import mongoose from 'mongoose';

const pagoSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
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
    enum: ['tarjeta', 'pse', 'efectivo'],
    required: true
  },
  estado: {
    type: String,
    enum: ['pendiente', 'completado', 'fallido', 'reembolsado'],
    default: 'pendiente'
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
