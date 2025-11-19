import mongoose from 'mongoose';

const estadioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del estadio es requerido'],
    trim: true
  },
  capacidad_total: {
    type: Number,
    default: null
  }
}, {
  timestamps: true
});

export default mongoose.model('Estadio', estadioSchema);
