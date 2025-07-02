// src/queries/consultas.js
const mongoose = require('mongoose');
const connectDB = require('../config/database');
const Usuario = require('../models/Usuario');
const Laboratorio = require('../models/Laboratorio');
const Equipo = require('../models/Equipo');

const ejecutarConsultas = async () => {
  try {
    await connectDB();
    console.log('🔍 EJECUTANDO CONSULTAS AVANZADAS\n');

    // ===== CONSULTA 1: Listar todos los usuarios =====
    console.log('1️⃣ LISTAR TODOS LOS USUARIOS');
    console.log('================================');
    const todosUsuarios = await Usuario.find({}, {
      nombre: 1,
      apellido: 1,
      correo: 1,
      rol: 1,
      activo: 1
    }).sort({ apellido: 1, nombre: 1 });

    console.log(`Total de usuarios: ${todosUsuarios.length}`);
    todosUsuarios.forEach(usuario => {
      console.log(`• ${usuario.nombreCompleto} - ${usuario.correo} (${usuario.rol})`);
    });
    console.log('\n');

    // ===== CONSULTA 2: Buscar laboratorios con equipos disponibles =====
    console.log('2️⃣ LABORATORIOS CON EQUIPOS DISPONIBLES');
    console.log('======================================');
    const labsConEquiposDisponibles = await Laboratorio.find({
      estado: 'disponible'
    }).populate({
      path: 'equipos',
      match: { estado: 'disponible' },
      select: 'nombre codigo tipo estado'
    }).populate('responsable', 'nombre apellido correo');

    labsConEquiposDisponibles.forEach(lab => {
      const equiposDisponibles = lab.equipos.length;
      console.log(`🏢 ${lab.nombre} (${lab.codigo})`);
      console.log(`   Responsable: ${lab.responsable.nombreCompleto}`);
      console.log(`   Equipos disponibles: ${equiposDisponibles}`);
      if (equiposDisponibles > 0) {
        lab.equipos.forEach(equipo => {
          console.log(`   • ${equipo.nombre} (${equipo.codigo}) - ${equipo.tipo}`);
        });
      }
      console.log('');
    });

    // ===== CONSULTA 3: Contar equipos por estado =====
    console.log('3️⃣ CANTIDAD DE EQUIPOS POR ESTADO');
    console.log('=================================');
    const equiposPorEstado = await Equipo.aggregate([
      {
        $group: {
          _id: '$estado',
          cantidad: { $sum: 1 },
          equipos: { $push: { nombre: '$nombre', codigo: '$codigo' } }
        }
      },
      {
        $sort: { cantidad: -1 }
      }
    ]);

    equiposPorEstado.forEach(grupo => {
      console.log(`📊 ${grupo._id.toUpperCase()}: ${grupo.cantidad} equipos`);
      grupo.equipos.forEach(equipo => {
        console.log(`   • ${equipo.nombre} (${equipo.codigo})`);
      });
      console.log('');
    });

    // ===== CONSULTA 4: Usuarios con correo @universidad.edu =====
    console.log('4️⃣ USUARIOS CON CORREO @universidad.edu');
    console.log('========================================');
    const usuariosUniversidad = await Usuario.find({
      correo: { $regex: /@universidad\.edu$/, $options: 'i' }
    }).select('nombre apellido correo rol');

    console.log(`Total: ${usuariosUniversidad.length} usuarios`);
    usuariosUniversidad.forEach(usuario => {
      console.log(`👤 ${usuario.nombreCompleto} - ${usuario.correo} (${usuario.rol})`);
    });
    console.log('\n');

    // ===== CONSULTA 5: Promedio de equipos por laboratorio usando aggregate =====
    console.log('5️⃣ ESTADÍSTICAS DE EQUIPOS POR LABORATORIO');
    console.log('==========================================');
    const estadisticasLabs = await Laboratorio.aggregate([
      {
        $lookup: {
          from: 'equipos',
          localField: '_id',
          foreignField: 'laboratorio',
          as: 'equiposDetalle'
        }
      },
      {
        $lookup: {
          from: 'usuarios',
          localField: 'responsable',
          foreignField: '_id',
          as: 'responsableDetalle'
        }
      },
      {
        $project: {
          nombre: 1,
          codigo: 1,
          tipo: 1,
          capacidad: 1,
          estado: 1,
          cantidadEquipos: { $size: '$equiposDetalle' },
          equiposDisponibles: {
            $size: {
              $filter: {
                input: '$equiposDetalle',
                cond: { $eq: ['$$this.estado', 'disponible'] }
              }
            }
          },
          responsable: { $arrayElemAt: ['$responsableDetalle', 0] },
          valorTotalEquipos: { $sum: '$equiposDetalle.valorAdquisicion' }
        }
      },
      {
        $group: {
          _id: null,
          totalLaboratorios: { $sum: 1 },
          totalEquipos: { $sum: '$cantidadEquipos' },
          promedioEquiposPorLab: { $avg: '$cantidadEquipos' },
          laboratorios: {
            $push: {
              nombre: '$nombre',
              codigo: '$codigo',
              tipo: '$tipo',
              estado: '$estado',
              cantidadEquipos: '$cantidadEquipos',
              equiposDisponibles: '$equiposDisponibles',
              responsable: '$responsable',
              valorTotal: '$valorTotalEquipos'
            }
          }
        }
      }
    ]);

    const stats = estadisticasLabs[0];
    console.log(`📈 RESUMEN GENERAL:`);
    console.log(`   Total de laboratorios: ${stats.totalLaboratorios}`);
    console.log(`   Total de equipos: ${stats.totalEquipos}`);
    console.log(`   Promedio de equipos por laboratorio: ${stats.promedioEquiposPorLab.toFixed(2)}`);
    console.log('\n📋 DETALLE POR LABORATORIO:');

    stats.laboratorios.forEach(lab => {
      console.log(`\n🏢 ${lab.nombre} (${lab.codigo})`);
      console.log(`   Tipo: ${lab.tipo} | Estado: ${lab.estado}`);
      console.log(`   Responsable: ${lab.responsable.nombre} ${lab.responsable.apellido}`);
      console.log(`   Equipos totales: ${lab.cantidadEquipos}`);
      console.log(`   Equipos disponibles: ${lab.equiposDisponibles}`);
      console.log(`   Valor total equipos: $${lab.valorTotal?.toLocaleString() || '0'}`);
    });

    // ===== CONSULTAS ADICIONALES AVANZADAS =====
    console.log('\n\n🔥 CONSULTAS ADICIONALES AVANZADAS');
    console.log('===================================');

    // Consulta 6: Equipos que necesitan mantenimiento
    console.log('\n6️⃣ EQUIPOS QUE REQUIEREN ATENCIÓN');
    const equiposAtencion = await Equipo.find({
      $or: [
        { estado: 'mantenimiento' },
        { estado: 'dañado' },
        {
          fechaAdquisicion: {
            $lt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) // Más de 1 año
          },
          'historialMantenimiento.0': { $exists: false }
        }
      ]
    }).populate('laboratorio', 'nombre codigo')
      .populate('usuarioAsignado', 'nombre apellido');

    equiposAtencion.forEach(equipo => {
      console.log(`⚠️  ${equipo.nombre} (${equipo.codigo})`);
      console.log(`   Estado: ${equipo.estado}`);
      console.log(`   Laboratorio: ${equipo.laboratorio.nombre}`);
      console.log(`   Mantenimientos: ${equipo.historialMantenimiento.length}`);
    });

    // Consulta 7: Usuarios más activos por laboratorio
    // console.log('\n7️⃣ ANÁLISIS DE ACTIVIDAD POR ROL');
    // const actividadPorRol = await Usuario.aggregate([
    //   {
    //     $group: {
    //       _id: '$rol',
    //       cantidad: { $sum: 1 },
    //       activos: {
    //         $sum: { $cond: [{ $eq: ['$activo', true] }, 1, 0] }
    //       },
    //       conTelefono: {
    //         $sum: { $cond: [{ $exists: ['$telefono', true] }, 1, 0] }
    //       }
    //     }
    //   },
    //   {
    //     $project: {
    //       _id: 1,
    //       cantidad: 1,
    //       activos: 1,
    //       inactivos: { $subtract: ['$cantidad', '$activos'] },
    //       porcentajeActivos: {
    //         $multiply: [{ $divide: ['$activos', '$cantidad'] }, 100] }
    //     }
    //   },
    //   { $sort: { cantidad: -1 } }
    // ]);

    // actividadPorRol.forEach(rol => {
    //   console.log(`👥 ROL: ${rol._id.toUpperCase()}`);
    //   console.log(`   Total: ${rol.cantidad} | Activos: ${rol.activos} | Inactivos: ${rol.inactivos}`);
    //   console.log(`   Porcentaje activos: ${rol.porcentajeActivos.toFixed(1)}%\n`);
    // });

    console.log('✅ Todas las consultas ejecutadas exitosamente');

  } catch (error) {
    console.error('❌ Error ejecutando consultas:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Conexión cerrada');
  }
};

// Ejecutar si se llama directamente
if (require.main === module) {
  ejecutarConsultas();
}

module.exports = { ejecutarConsultas };