import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Usuario from './models/Usuario.js';
import Estadio from './models/Estadio.js';
import Localidad from './models/Localidad.js';
import Partido from './models/Partido.js';
import Silla from './models/Silla.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Limpiar colecciones existentes
    await Usuario.deleteMany({});
    await Estadio.deleteMany({});
    await Localidad.deleteMany({});
    await Partido.deleteMany({});
    await Silla.deleteMany({});
    console.log('🗑️  Colecciones limpiadas');

    // Crear usuarios
    const admin = await Usuario.create({
      nombre: 'Admin Principal',
      email: 'admin@estadio.com',
      contraseña: 'admin123',
      rol: 'admin'
    });

    const usuario1 = await Usuario.create({
      nombre: 'Juan Pérez',
      email: 'juan@email.com',
      contraseña: '123456',
      rol: 'aficionado'
    });

    console.log('✅ Usuarios creados');

    // Crear estadios
    const estadio1 = await Estadio.create({
      nombre: 'Estadio El Campín',
      ciudad: 'Bogotá',
      capacidad: 36000,
      direccion: 'Cra. 30 #57-60',
      imagen: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800'
    });

    const estadio2 = await Estadio.create({
      nombre: 'Estadio Atanasio Girardot',
      ciudad: 'Medellín',
      capacidad: 40000,
      direccion: 'Carrera 70 #49-02',
      imagen: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800'
    });

    console.log('✅ Estadios creados');

    // Crear localidades para estadio 1
    const localidades1 = await Localidad.create([
      {
        nombre: 'Norte',
        estadio: estadio1._id,
        precio_base: 50000,
        capacidad: 8000
      },
      {
        nombre: 'Sur',
        estadio: estadio1._id,
        precio_base: 50000,
        capacidad: 8000
      },
      {
        nombre: 'Oriental',
        estadio: estadio1._id,
        precio_base: 75000,
        capacidad: 6000
      },
      {
        nombre: 'Occidental',
        estadio: estadio1._id,
        precio_base: 75000,
        capacidad: 6000
      },
      {
        nombre: 'Palco',
        estadio: estadio1._id,
        precio_base: 150000,
        capacidad: 2000
      }
    ]);

    // Crear localidades para estadio 2
    const localidades2 = await Localidad.create([
      {
        nombre: 'Norte',
        estadio: estadio2._id,
        precio_base: 60000,
        capacidad: 10000
      },
      {
        nombre: 'Sur',
        estadio: estadio2._id,
        precio_base: 60000,
        capacidad: 10000
      },
      {
        nombre: 'Palco',
        estadio: estadio2._id,
        precio_base: 180000,
        capacidad: 3000
      }
    ]);

    console.log('✅ Localidades creadas');

    // Crear partidos
    const partidos = await Partido.create([
      {
        equipo_local: 'Millonarios',
        equipo_visitante: 'Nacional',
        fecha: new Date('2024-12-25'),
        hora: '19:00',
        estadio: estadio1._id,
        precio_base: 50000,
        imagen: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
        descripcion: 'Clásico colombiano - Final de temporada'
      },
      {
        equipo_local: 'América',
        equipo_visitante: 'Cali',
        fecha: new Date('2024-12-28'),
        hora: '16:00',
        estadio: estadio1._id,
        precio_base: 45000,
        imagen: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800',
        descripcion: 'Derby vallecaucano'
      },
      {
        equipo_local: 'Medellín',
        equipo_visitante: 'Junior',
        fecha: new Date('2024-12-30'),
        hora: '18:30',
        estadio: estadio2._id,
        precio_base: 55000,
        imagen: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800',
        descripcion: 'Partido de ida semifinales'
      },
      {
        equipo_local: 'Santa Fe',
        equipo_visitante: 'Tolima',
        fecha: new Date('2025-01-05'),
        hora: '20:00',
        estadio: estadio1._id,
        precio_base: 40000,
        imagen: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800',
        descripcion: 'Jornada 1 - Torneo de apertura'
      },
      {
        equipo_local: 'Bucaramanga',
        equipo_visitante: 'Pereira',
        fecha: new Date('2025-01-08'),
        hora: '15:00',
        estadio: estadio1._id,
        precio_base: 35000,
        imagen: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800',
        descripcion: 'Jornada 2 - Torneo de apertura'
      }
    ]);

    console.log('✅ Partidos creados');

    // Crear algunas sillas de ejemplo
    const sillasEjemplo = [];
    const filas = ['A', 'B', 'C', 'D', 'E'];
    
    for (let localidad of localidades1) {
      for (let fila of filas) {
        for (let num = 1; num <= 10; num++) {
          sillasEjemplo.push({
            numero: num.toString(),
            fila: fila,
            localidad: localidad._id,
            estado: 'disponible'
          });
        }
      }
    }

    await Silla.create(sillasEjemplo);
    console.log('✅ Sillas de ejemplo creadas');

    console.log('\n🎉 Base de datos poblada exitosamente!\n');
    console.log('📧 Credenciales de Admin:');
    console.log('   Email: admin@estadio.com');
    console.log('   Contraseña: admin123\n');
    console.log('📧 Credenciales de Usuario:');
    console.log('   Email: juan@email.com');
    console.log('   Contraseña: 123456\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error poblando la base de datos:', error);
    process.exit(1);
  }
};

seedDatabase();
