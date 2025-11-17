import mongoose from 'mongoose';

const localidadSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre de la localidad es requerido'],
    enum: ['Norte', 'Sur', 'Oriental', 'Occidental', 'Palco']
  },
  estadio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Estadio',
    required: true
  },
  precio_base: {
    type: Number,
    required: [true, 'El precio base es requerido']
  },
  capacidad: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Localidad', localidadSchema);
