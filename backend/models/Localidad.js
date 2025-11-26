import mongoose from 'mongoose';

const localidadSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre de la localidad es requerido'],
    trim: true
  },
  estadio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Estadio',
    required: true
  },
  filas: {
    type: Number,
    required: true
  },
  columnas: {
    type: Number,
    required: true
  },
  precio_base: {
    type: Number,
    required: [true, 'El precio base es requerido']
  }
}, {
  timestamps: true,
  collection: 'localidads'
});

export default mongoose.model('Localidad', localidadSchema);
