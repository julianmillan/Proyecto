import mongoose from 'mongoose';

const estadioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del estadio es requerido'],
    trim: true
  },
  ciudad: {
    type: String,
    required: [true, 'La ciudad es requerida'],
    trim: true
  },
  capacidad: {
    type: Number,
    required: [true, 'La capacidad es requerida']
  },
  direccion: {
    type: String,
    trim: true
  },
  imagen: {
    type: String
  }
}, {
  timestamps: true
});

export default mongoose.model('Estadio', estadioSchema);
