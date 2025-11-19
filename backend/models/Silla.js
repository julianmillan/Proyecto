import mongoose from 'mongoose';

const sillaSchema = new mongoose.Schema({
  fila: {
    type: Number,
    required: [true, 'La fila es requerida']
  },
  columna: {
    type: Number,
    required: [true, 'La columna es requerida']
  },
  localidad: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Localidad',
    required: true
  }
}, {
  timestamps: true
});

// Índice compuesto para evitar duplicados
sillaSchema.index({ fila: 1, columna: 1, localidad: 1 }, { unique: true });

// Eliminar índice antiguo si existe
sillaSchema.pre('save', async function() {
  try {
    await this.collection.dropIndex('numero_1_fila_1_localidad_1');
  } catch (err) {
    // Índice no existe, continuar
  }
});

export default mongoose.model('Silla', sillaSchema);
