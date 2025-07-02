// src/models/Laboratorio.js
const mongoose = require('mongoose');

const laboratorioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del laboratorio es obligatorio'],
    unique: true,
    trim: true
  },
  codigo: {
    type: String,
    required: [true, 'El código es obligatorio'],
    unique: true,
    uppercase: true,
    match: [/^LAB-\d{3}$/, 'El código debe seguir el formato LAB-XXX']
  },
  ubicacion: {
    edificio: {
      type: String,
      required: true
    },
    piso: {
      type: Number,
      required: true,
      min: 1
    },
    aula: {
      type: String,
      required: true
    }
  },
  capacidad: {
    type: Number,
    required: [true, 'La capacidad es obligatoria'],
    min: [1, 'La capacidad debe ser mayor a 0']
  },
  tipo: {
    type: String,
    enum: ['informatica', 'fisica', 'quimica', 'biologia', 'electronica'],
    required: true
  },
  estado: {
    type: String,
    enum: ['disponible', 'ocupado', 'mantenimiento', 'fuera_servicio'],
    default: 'disponible'
  },
  horarioDisponible: {
    lunes: { inicio: String, fin: String },
    martes: { inicio: String, fin: String },
    miercoles: { inicio: String, fin: String },
    jueves: { inicio: String, fin: String },
    viernes: { inicio: String, fin: String },
    sabado: { inicio: String, fin: String }
  },
  responsable: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  equipos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipo'
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

// Virtual para ubicación completa
laboratorioSchema.virtual('ubicacionCompleta').get(function() {
  return `${this.ubicacion.edificio} - Piso ${this.ubicacion.piso} - Aula ${this.ubicacion.aula}`;
});

// Índices
laboratorioSchema.index({ codigo: 1 });
laboratorioSchema.index({ tipo: 1, estado: 1 });
laboratorioSchema.index({ responsable: 1 });

module.exports = mongoose.model('Laboratorio', laboratorioSchema);