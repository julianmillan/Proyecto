import mongoose from 'mongoose';

const partidoSchema = new mongoose.Schema({
  equipo_local: {
    type: String,
    required: [true, 'El equipo local es requerido'],
    trim: true
  },
  equipo_visitante: {
    type: String,
    required: [true, 'El equipo visitante es requerido'],
    trim: true
  },
  fecha: {
    type: Date,
    required: [true, 'La fecha del partido es requerida']
  },
  hora: {
    type: String,
    required: [true, 'La hora del partido es requerida']
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
  estado: {
    type: String,
    enum: ['programado', 'en_curso', 'finalizado', 'cancelado'],
    default: 'programado'
  },
  imagen: {
    type: String
  },
  descripcion: {
    type: String
  }
}, {
  timestamps: true
});

export default mongoose.model('Partido', partidoSchema);
