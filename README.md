# 🏛️ Sistema de Gestión de Laboratorios Universitarios
## MongoDB + Mongoose + Docker

## 👨‍💻 Autor

- 📧 Nombre: [Elvis Ramirez]
- 🐙 GitHub: [@Elvis Ramirez]


---

## 📋 Introducción

Este proyecto implementa un **Sistema de Gestión de Laboratorios Universitarios** utilizando MongoDB como base de datos NoSQL, Mongoose como ODM (Object Document Mapper), y Docker para la containerización del entorno de desarrollo. 

El sistema permite gestionar usuarios, laboratorios y equipos universitarios, implementando relaciones complejas entre colecciones y consultas avanzadas con agregaciones.

---

## 🎯 Objetivos

### Objetivo General
Desarrollar e implementar consultas avanzadas y relaciones entre colecciones utilizando **Mongoose** sobre una base de datos **MongoDB**, integrando contenedores Docker para el entorno de desarrollo.

### Objetivos Específicos
- ✅ Configurar un entorno de desarrollo usando Docker Compose
- ✅ Diseñar modelos de datos NoSQL con Mongoose
- ✅ Implementar relaciones entre colecciones (uno-a-muchos, embebidos, referencias)
- ✅ Desarrollar consultas básicas y avanzadas con agregaciones
- ✅ Utilizar operadores de consulta de MongoDB
- ✅ Aplicar buenas prácticas de desarrollo y documentación

---

## 🛠️ Tecnologías Utilizadas

| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| **MongoDB** | 7.0 | Base de datos NoSQL orientada a documentos |
| **Mongoose** | 8.0.0 | ODM para MongoDB en Node.js |
| **Node.js** | 18+ | Runtime de JavaScript para el backend |
| **Docker** | Latest | Plataforma de containerización |
| **Docker Compose** | Latest | Herramienta para definir aplicaciones multi-contenedor |
| **Mongo Express** | 1.0.0 | Interfaz web para administrar MongoDB |

### Dependencias del Proyecto
```json
{
  "dependencies": {
    "mongoose": "^8.0.0",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

---

## 🚀 Instrucciones de Instalación y Ejecución

### Prerrequisitos
- Docker y Docker Compose instalados
- Node.js (versión 18 o superior)
- Git

### Paso 1: Clonar el Repositorio
```bash
git clone <url-del-repositorio>
cd proyecto-mongodb-laboratorios
```

### Paso 2: Instalar Dependencias
```bash
npm install
```

### Paso 3: Configurar Variables de Entorno
Crear archivo `.env` en la raíz del proyecto:
```env
MONGODB_URI=mongodb://admin:password123@localhost:27017/universidad_db?authSource=admin
NODE_ENV=development
```

### Paso 4: Levantar el Entorno Docker
```bash
# Levantar contenedores en segundo plano
docker-compose up -d

# Verificar que los contenedores están corriendo
docker-compose ps
```

### Paso 5: Poblar la Base de Datos
```bash
# Ejecutar script de seeds
npm run seed
```

### Paso 6: Ejecutar las Consultas
```bash
# Ejecutar todas las consultas de demostración
npm run queries

# O ejecutar la aplicación completa
npm start
```

### Paso 7: Acceder a Mongo Express
- **URL**: http://localhost:8081
- **Descripción**: Interfaz web para explorar la base de datos

---

## 📷 Capturas de Pantalla

### 🐳 Entorno Docker
![Docker Containers](https://via.placeholder.com/800x400/2496ED/ffffff?text=Docker+Containers+Running)
*Contenedores MongoDB y Mongo Express ejecutándose*

### 🌐 Mongo Express - Vista de Colecciones
![Mongo Express Collections](https://via.placeholder.com/800x400/4EA94B/ffffff?text=Mongo+Express+-+Collections+View)
*Interfaz de Mongo Express mostrando las colecciones: usuarios, laboratorios, equipos*

### 📊 Resultados de Consultas
![Query Results](https://via.placeholder.com/800x400/43853D/ffffff?text=Query+Results+in+Terminal)
*Resultados de las consultas avanzadas ejecutadas en terminal*

### 🔍 Consulta de Agregación
![Aggregation Pipeline](https://via.placeholder.com/800x400/880000/ffffff?text=Aggregation+Pipeline+Results)
*Resultados de la consulta de agregación mostrando estadísticas por laboratorio*

---

## 🗂️ Estructura del Proyecto

```
proyecto-mongodb-laboratorios/
├── 📁 src/
│   ├── 📁 models/
│   │   ├── 📄 Usuario.js          # Modelo de usuarios
│   │   ├── 📄 Laboratorio.js      # Modelo de laboratorios
│   │   └── 📄 Equipo.js           # Modelo de equipos
│   ├── 📁 config/
│   │   └── 📄 database.js         # Configuración de conexión
│   ├── 📁 seeds/
│   │   └── 📄 seedData.js         # Datos de prueba
│   ├── 📁 queries/
│   │   └── 📄 consultas.js        # Consultas avanzadas
│   └── 📄 index.js                # Archivo principal
├── 📄 docker-compose.yml          # Configuración Docker
├── 📄 package.json               # Dependencias del proyecto
├── 📄 .env                       # Variables de entorno
├── 📄 .gitignore                 # Archivos ignorados por Git
└── 📄 README.md                  # Documentación del proyecto
```

---

## 🔗 Relaciones entre Colecciones

### 📊 Diagrama de Relaciones
```
┌─────────────────┐    1:N    ┌──────────────────┐    1:N    ┌─────────────────┐
│     USUARIO     │◄─────────►│   LABORATORIO    │◄─────────►│     EQUIPO      │
├─────────────────┤           ├──────────────────┤           ├─────────────────┤
│ _id (ObjectId)  │           │ _id (ObjectId)   │           │ _id (ObjectId)  │
│ nombre          │           │ nombre           │           │ nombre          │
│ correo (único)  │           │ codigo (único)   │           │ codigo (único)  │
│ rol (enum)      │           │ ubicacion {}     │           │ tipo (enum)     │
│ laboratorios[]  │───────────│ responsable      │───────────│ laboratorio     │
└─────────────────┘           │ equipos[]        │           │ usuarioAsignado │
                              └──────────────────┘           └─────────────────┘
```

### 🔑 Tipos de Relaciones Implementadas

#### 1. **Uno a Muchos (Referenciada)**
- **Usuario → Laboratorios**: Un usuario puede ser responsable de múltiples laboratorios
- **Laboratorio → Equipos**: Un laboratorio contiene múltiples equipos

```javascript
// Ejemplo: Obtener laboratorio con todos sus equipos
const laboratorio = await Laboratorio.findById(labId)
  .populate('equipos')
  .populate('responsable', 'nombre apellido correo');
```

#### 2. **Uno a Uno (Referenciada)**
- **Equipo → Usuario Asignado**: Un equipo puede estar asignado a un usuario específico

#### 3. **Documentos Embebidos**
- **Laboratorio → Ubicación**: Información de ubicación como subdocumento
- **Equipo → Especificaciones**: Detalles técnicos embebidos
- **Equipo → Historial**: Array de subdocumentos de mantenimiento

```javascript
// Ejemplo: Estructura embebida
{
  ubicacion: {
    edificio: "Edificio A",
    piso: 2,
    aula: "A-201"
  }
}
```

---

## 🔍 Consultas Implementadas

### 📈 Resumen de Consultas

| # | Consulta | Descripción | Técnicas Utilizadas |
|---|----------|-------------|-------------------|
| **1** | Listar todos los usuarios | Consulta básica con ordenamiento | `.find()`, `.sort()`, projection |
| **2** | Laboratorios con equipos disponibles | Filtrado con populate condicional | `.populate()`, match conditions |
| **3** | Contar equipos por estado | Agregación para estadísticas | `.aggregate()`, `$group`, `$sum` |
| **4** | Usuarios con correo universidad | Búsqueda con expresiones regulares | `$regex`, `$options` |
| **5** | Promedio de equipos por laboratorio | Agregación compleja con lookup | `$lookup`, `$group`, `$avg` |
| **6** | Equipos que necesitan mantenimiento | Consultas condicionales complejas | `$or`, `$lt`, `$exists` |
| **7** | Análisis de actividad por rol | Estadísticas avanzadas | `$group`, `$cond`, `$divide` |

### 🎯 Ejemplos de Consultas Destacadas

#### Consulta 1: Listado Básico con Ordenamiento
```javascript
const usuarios = await Usuario.find({}, {
  nombre: 1,
  apellido: 1,
  correo: 1,
  rol: 1,
  activo: 1
}).sort({ apellido: 1, nombre: 1 });
```

#### Consulta 2: Populate con Filtros
```javascript
const laboratorios = await Laboratorio.find({ estado: 'disponible' })
  .populate({
    path: 'equipos',
    match: { estado: 'disponible' },
    select: 'nombre codigo tipo estado'
  })
  .populate('responsable', 'nombre apellido correo');
```

#### Consulta 3: Agregación Compleja
```javascript
const estadisticas = await Laboratorio.aggregate([
  {
    $lookup: {
      from: 'equipos',
      localField: '_id',
      foreignField: 'laboratorio',
      as: 'equiposDetalle'
    }
  },
  {
    $group: {
      _id: null,
      totalLaboratorios: { $sum: 1 },
      totalEquipos: { $sum: { $size: '$equiposDetalle' } },
      promedioEquipos: { $avg: { $size: '$equiposDetalle' } }
    }
  }
]);
```

#### Consulta 4: Expresiones Regulares
```javascript
const usuariosUniversidad = await Usuario.find({
  correo: { $regex: /@universidad\.edu$/, $options: 'i' }
});
```

---

## 🏗️ Características Técnicas Avanzadas

### ✅ Validaciones Implementadas
- **Emails**: Validación con regex para formato correcto
- **Cédulas**: Validación de 10 dígitos para cédulas ecuatorianas
- **Enums**: Valores predefinidos para roles, estados, tipos
- **Uniqueness**: Campos únicos para códigos y correos

### 🔧 Optimizaciones
- **Índices**: Índices simples y compuestos para consultas frecuentes
- **Virtuals**: Campos calculados (ej: nombreCompleto)
- **Timestamps**: Campos automáticos de creación y actualización
- **Sparse Indexes**: Para campos opcionales únicos

### 🎨 Funcionalidades Adicionales
- **Middleware**: Pre y post hooks de Mongoose
- **Subdocumentos**: Historial de mantenimiento embebido
- **Referencias**: Relaciones flexibles entre colecciones
- **Proyecciones**: Selección específica de campos

---

## 📊 Datos de Prueba

El proyecto incluye un conjunto completo de datos de prueba que se cargan automáticamente:

- **👥 5 Usuarios**: Profesores, estudiantes, administradores y técnicos
- **🏢 3 Laboratorios**: Informática, Física y Electrónica
- **💻 5 Equipos**: Computadoras, proyectores, microscopios, etc.

### Ejemplo de Datos
```javascript
// Usuario de ejemplo
{
  nombre: "Juan Carlos",
  apellido: "Pérez García",
  correo: "juan.perez@universidad.edu",
  rol: "profesor",
  cedula: "1234567890"
}

// Laboratorio de ejemplo
{
  nombre: "Laboratorio de Informática 1",
  codigo: "LAB-001",
  ubicacion: {
    edificio: "Edificio A",
    piso: 2,
    aula: "A-201"
  },
  capacidad: 30,
  tipo: "informatica"
}
```

---

## 🎯 Resultados Esperados

### 📈 Salida de Consultas
Al ejecutar `npm run queries`, deberías ver:

```
🔍 EJECUTANDO CONSULTAS AVANZADAS

1️⃣ LISTAR TODOS LOS USUARIOS
================================
Total de usuarios: 5
• González López María Elena - maria.gonzalez@universidad.edu (administrador)
• Martínez Flores Ana Sofía - ana.martinez@universidad.edu (tecnico)
• Pérez García Juan Carlos - juan.perez@universidad.edu (profesor)
• Rodríguez Sánchez Carlos Alberto - carlos.rodriguez@estudiante.edu (estudiante)
• Vásquez Torres Diego Fernando - diego.vasquez@estudiante.edu (estudiante)

2️⃣ LABORATORIOS CON EQUIPOS DISPONIBLES
======================================
🏢 Laboratorio de Informática 1 (LAB-001)
   Responsable: Juan Carlos Pérez García
   Equipos disponibles: 2
   • Computadora HP EliteDesk (PC-001) - computadora
   • Proyector BenQ (PRY-001) - proyector

...
```

---

## 🐳 Comandos Docker Útiles

```bash
# Levantar servicios
docker-compose up -d

# Ver estado de contenedores
docker-compose ps

# Ver logs en tiempo real
docker-compose logs -f

# Parar servicios
docker-compose down

# Limpiar volúmenes (⚠️ Elimina todos los datos)
docker-compose down -v

# Reiniciar servicios
docker-compose restart
```

---

## 🔧 Scripts NPM Disponibles

```bash
# Iniciar aplicación
npm start

# Modo desarrollo con nodemon
npm run dev

# Poblar base de datos con datos de prueba
npm run seed

# Ejecutar consultas de demostración
npm run queries
```

---

## 🎓 Conclusiones Personales

### 🚀 Aprendizajes Técnicos

1. **MongoDB como Base de Datos NoSQL**: La flexibilidad de MongoDB permite un modelado de datos más natural para aplicaciones modernas, especialmente cuando los requisitos pueden evolucionar.

2. **Mongoose como ODM**: Proporciona una capa de abstracción valiosa que combina la flexibilidad de MongoDB con validaciones robustas y un sistema de tipos más estructurado.

3. **Docker para Desarrollo**: La containerización simplifica enormemente la configuración del entorno de desarrollo, garantizando consistencia entre diferentes máquinas y facilitando la colaboración en equipo.

### 💡 Insights sobre Relaciones NoSQL

4. **Diseño de Relaciones**: La decisión entre documentos embebidos vs. referencias depende del patrón de acceso a los datos:
   - **Embebidos**: Para datos que se consultan juntos frecuentemente
   - **Referencias**: Para datos que se consultan independientemente o que pueden crecer ilimitadamente

5. **Agregation Pipeline**: Es una herramienta extremadamente poderosa para análisis de datos complejos, aunque requiere una curva de aprendizaje considerable.

6. **Validación en Múltiples Niveles**: Implementar validaciones tanto en el esquema de Mongoose como en la lógica de aplicación proporciona robustez y mejor experiencia de usuario.

7. **Índices Estratégicos**: Los índices bien planificados son cruciales para el rendimiento, especialmente en consultas frecuentes y ordenamientos.

8. **Separación de Responsabilidades**: Mantener modelos, configuración, seeds y consultas en archivos separados mejora la mantenibilidad del código.

### 🔮 Aplicabilidad Futura

9. **Escalabilidad**: Los patrones implementados en este proyecto son directamente aplicables a sistemas de mayor escala, incluyendo microservicios y arquitecturas distribuidas.

10. **Versatilidad**: Las técnicas de agregación y modelado de datos aprendidas son transferibles a otros dominios de aplicación más allá de la gestión universitaria.

### 🎯 Desafíos Superados

11. **Complejidad de Agregaciones**: Dominar el aggregation pipeline requirió práctica considerable, pero el resultado son consultas muy expresivas y eficientes.

12. **Gestión de Relaciones**: Balancear la desnormalización con la consistencia de datos fue un desafío interesante que requirió considerar múltiples factores.



## 📚 Referencias

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [Node.js Documentation](https://nodejs.org/docs/)

---
