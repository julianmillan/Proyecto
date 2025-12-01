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
    enum: ['PROGRAMADO', 'SIMULADO', 'FINALIZADO', 'CANCELADO'],
    default: 'PROGRAMADO'
  },
  imagen: {
    type: String
  },
  // Campos para simulación de partidos
  simulado: {
    type: Boolean,
    default: false
  },
  resultado: {
    goles_local: { type: Number, default: 0 },
    goles_visitante: { type: Number, default: 0 }
  },
  estadisticas: {
    posesion_local: { type: Number, min: 0, max: 100 },
    posesion_visitante: { type: Number, min: 0, max: 100 },
    tarjetas_amarillas_local: { type: Number, default: 0 },
    tarjetas_amarillas_visitante: { type: Number, default: 0 },
    tarjetas_rojas_local: { type: Number, default: 0 },
    tarjetas_rojas_visitante: { type: Number, default: 0 },
    tiros_arco_local: { type: Number, default: 0 },
    tiros_arco_visitante: { type: Number, default: 0 }
  },
  asistencia_real: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model('Partido', partidoSchema);
