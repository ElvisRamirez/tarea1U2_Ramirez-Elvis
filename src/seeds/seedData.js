// src/seeds/seedData.js
const mongoose = require('mongoose');
const connectDB = require('../config/database');
const Usuario = require('../models/Usuario');
const Laboratorio = require('../models/Laboratorio');
const Equipo = require('../models/Equipo');

const seedDatabase = async () => {
  try {
    await connectDB();

    // Limpiar base de datos
    await Usuario.deleteMany({});
    await Laboratorio.deleteMany({});
    await Equipo.deleteMany({});

    console.log('Base de datos limpiada');

    // Crear usuarios
    const usuarios = await Usuario.create([
      {
        nombre: 'Juan Carlos',
        apellido: 'Pérez García',
        correo: 'juan.perez@universidad.edu',
        rol: 'profesor',
        cedula: '1234567890',
        telefono: '0987654321'
      },
      {
        nombre: 'María Elena',
        apellido: 'González López',
        correo: 'maria.gonzalez@universidad.edu',
        rol: 'administrador',
        cedula: '0987654321',
        telefono: '0912345678'
      },
      {
        nombre: 'Carlos Alberto',
        apellido: 'Rodríguez Sánchez',
        correo: 'carlos.rodriguez@estudiante.edu',
        rol: 'estudiante',
        cedula: '1122334455',
        telefono: '0923456789'
      },
      {
        nombre: 'Ana Sofía',
        apellido: 'Martínez Flores',
        correo: 'ana.martinez@universidad.edu',
        rol: 'tecnico',
        cedula: '5544332211',
        telefono: '0934567890'
      },
      {
        nombre: 'Diego Fernando',
        apellido: 'Vásquez Torres',
        correo: 'diego.vasquez@estudiante.edu',
        rol: 'estudiante',
        cedula: '6677889900',
        telefono: '0945678901'
      }
    ]);

    console.log('Usuarios creados');

    // Crear laboratorios
    const laboratorios = await Laboratorio.create([
      {
        nombre: 'Laboratorio de Informática 1',
        codigo: 'LAB-001',
        ubicacion: {
          edificio: 'Edificio A',
          piso: 2,
          aula: 'A-201'
        },
        capacidad: 30,
        tipo: 'informatica',
        estado: 'disponible',
        responsable: usuarios[0]._id,
        horarioDisponible: {
          lunes: { inicio: '08:00', fin: '18:00' },
          martes: { inicio: '08:00', fin: '18:00' },
          miercoles: { inicio: '08:00', fin: '18:00' },
          jueves: { inicio: '08:00', fin: '18:00' },
          viernes: { inicio: '08:00', fin: '16:00' }
        }
      },
      {
        nombre: 'Laboratorio de Física',
        codigo: 'LAB-002',
        ubicacion: {
          edificio: 'Edificio B',
          piso: 1,
          aula: 'B-105'
        },
        capacidad: 25,
        tipo: 'fisica',
        estado: 'disponible',
        responsable: usuarios[1]._id,
        horarioDisponible: {
          lunes: { inicio: '07:00', fin: '17:00' },
          martes: { inicio: '07:00', fin: '17:00' },
          miercoles: { inicio: '07:00', fin: '17:00' },
          jueves: { inicio: '07:00', fin: '17:00' },
          viernes: { inicio: '07:00', fin: '15:00' }
        }
      },
      {
        nombre: 'Laboratorio de Electrónica',
        codigo: 'LAB-003',
        ubicacion: {
          edificio: 'Edificio C',
          piso: 3,
          aula: 'C-301'
        },
        capacidad: 20,
        tipo: 'electronica',
        estado: 'mantenimiento',
        responsable: usuarios[3]._id,
        horarioDisponible: {
          lunes: { inicio: '08:00', fin: '16:00' },
          martes: { inicio: '08:00', fin: '16:00' },
          miercoles: { inicio: '08:00', fin: '16:00' },
          jueves: { inicio: '08:00', fin: '16:00' }
        }
      }
    ]);

    console.log('Laboratorios creados');

    // Crear equipos
    const equipos = await Equipo.create([
      // Equipos para Lab Informática
      {
        nombre: 'Computadora HP EliteDesk',
        codigo: 'PC-001',
        tipo: 'computadora',
        marca: 'HP',
        modelo: 'EliteDesk 800 G5',
        numeroSerie: 'HP001234567',
        especificaciones: {
          procesador: 'Intel Core i5-9500',
          ram: '8GB DDR4',
          almacenamiento: '256GB SSD',
          sistemaOperativo: 'Windows 11 Pro'
        },
        estado: 'disponible',
        fechaAdquisicion: new Date('2023-01-15'),
        valorAdquisicion: 1200,
        laboratorio: laboratorios[0]._id
      },
      {
        nombre: 'Proyector BenQ',
        codigo: 'PRY-001',
        tipo: 'proyector',
        marca: 'BenQ',
        modelo: 'MX535',
        numeroSerie: 'BQ987654321',
        estado: 'disponible',
        fechaAdquisicion: new Date('2022-08-20'),
        valorAdquisicion: 450,
        laboratorio: laboratorios[0]._id
      },
      // Equipos para Lab Física
      {
        nombre: 'Microscopio Olympus',
        codigo: 'MIC-001',
        tipo: 'microscopio',
        marca: 'Olympus',
        modelo: 'CX23',
        numeroSerie: 'OLY123456789',
        estado: 'disponible',
        fechaAdquisicion: new Date('2023-03-10'),
        valorAdquisicion: 2500,
        laboratorio: laboratorios[1]._id
      },
      // Equipos para Lab Electrónica
      {
        nombre: 'Osciloscopio Tektronix',
        codigo: 'OSC-001',
        tipo: 'osciloscopio',
        marca: 'Tektronix',
        modelo: 'TBS1052B',
        numeroSerie: 'TEK555666777',
        estado: 'mantenimiento',
        fechaAdquisicion: new Date('2022-11-05'),
        valorAdquisicion: 800,
        laboratorio: laboratorios[2]._id,
        historialMantenimiento: [{
          fecha: new Date(),
          tipo: 'preventivo',
          descripcion: 'Calibración anual',
          tecnico: usuarios[3]._id,
          costo: 150
        }]
      },
      {
        nombre: 'Multímetro Fluke',
        codigo: 'MUL-001',
        tipo: 'multimetro',
        marca: 'Fluke',
        modelo: '117',
        numeroSerie: 'FLU888999000',
        estado: 'disponible',
        fechaAdquisicion: new Date('2023-02-28'),
        valorAdquisicion: 180,
        laboratorio: laboratorios[2]._id
      }
    ]);

    console.log('Equipos creados');

    // Actualizar laboratorios con equipos
    for (let i = 0; i < laboratorios.length; i++) {
      const equiposLab = equipos.filter(eq => eq.laboratorio.toString() === laboratorios[i]._id.toString());
      await Laboratorio.findByIdAndUpdate(
        laboratorios[i]._id,
        { $push: { equipos: { $each: equiposLab.map(eq => eq._id) } } }
      );
    }

    console.log('✅ Base de datos poblada exitosamente');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error poblando la base de datos:', error);
    process.exit(1);
  }
};

seedDatabase();