// src/models/Equipo.js
const mongoose = require('mongoose');

const equipoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del equipo es obligatorio'],
    trim: true
  },
  codigo: {
    type: String,
    required: [true, 'El código es obligatorio'],
    unique: true,
    uppercase: true
  },
  tipo: {
    type: String,
    enum: ['computadora', 'proyector', 'impresora', 'scanner', 'microscopio', 'osciloscopio', 'multimetro', 'otro'],
    required: true
  },
  marca: {
    type: String,
    required: true,
    trim: true
  },
  modelo: {
    type: String,
    required: true,
    trim: true
  },
  numeroSerie: {
    type: String,
    unique: true,
    sparse: true
  },
  especificaciones: {
    procesador: String,
    ram: String,
    almacenamiento: String,
    sistemaOperativo: String,
    otros: [String]
  },
  estado: {
    type: String,
    enum: ['disponible', 'en_uso', 'mantenimiento', 'dañado', 'fuera_servicio'],
    default: 'disponible'
  },
  fechaAdquisicion: {
    type: Date,
    required: true
  },
  valorAdquisicion: {
    type: Number,
    min: 0
  },
  laboratorio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Laboratorio',
    required: true
  },
  usuarioAsignado: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
  },
  historialMantenimiento: [{
    fecha: {
      type: Date,
      default: Date.now
    },
    tipo: {
      type: String,
      enum: ['preventivo', 'correctivo', 'calibracion']
    },
    descripcion: String,
    tecnico: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario'
    },
    costo: Number
  }],
  activo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual para información completa
equipoSchema.virtual('informacionCompleta').get(function() {
  return `${this.marca} ${this.modelo} - ${this.codigo}`;
});

// Índices
equipoSchema.index({ codigo: 1 });
equipoSchema.index({ tipo: 1, estado: 1 });
equipoSchema.index({ laboratorio: 1 });
equipoSchema.index({ usuarioAsignado: 1 });

module.exports = mongoose.model('Equipo', equipoSchema);