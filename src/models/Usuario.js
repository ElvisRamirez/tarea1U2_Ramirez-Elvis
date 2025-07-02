// src/models/Usuario.js
const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
    minlength: [2, 'El nombre debe tener al menos 2 caracteres']
  },
  apellido: {
    type: String,
    required: [true, 'El apellido es obligatorio'],
    trim: true
  },
  correo: {
    type: String,
    required: [true, 'El correo es obligatorio'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Formato de correo inválido']
  },
  rol: {
    type: String,
    enum: ['estudiante', 'profesor', 'administrador', 'tecnico'],
    default: 'estudiante'
  },
  cedula: {
    type: String,
    required: true,
    unique: true,
    match: [/^\d{10}$/, 'La cédula debe tener 10 dígitos']
  },
  telefono: {
    type: String,
    match: [/^\d{10}$/, 'El teléfono debe tener 10 dígitos']
  },
  activo: {
    type: Boolean,
    default: true
  },
  fechaRegistro: {
    type: Date,
    default: Date.now
  },
  laboratoriosAsignados: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Laboratorio'
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual para nombre completo
usuarioSchema.virtual('nombreCompleto').get(function() {
  return `${this.nombre} ${this.apellido}`;
});

// Índices
usuarioSchema.index({ correo: 1 });
usuarioSchema.index({ cedula: 1 });
usuarioSchema.index({ rol: 1, activo: 1 });

module.exports = mongoose.model('Usuario', usuarioSchema);