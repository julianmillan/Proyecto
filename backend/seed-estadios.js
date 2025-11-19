import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Estadio from './models/Estadio.js';
import Localidad from './models/Localidad.js';
import Silla from './models/Silla.js';
import Usuario from './models/Usuario.js';
import Partido from './models/Partido.js';

dotenv.config();

const estadios = [
  { nombre: 'Metropolitano Roberto Meléndez', capacidad_total: 49000 },
  { nombre: 'Atanasio Girardot', capacidad_total: 46000 },
  { nombre: 'General Santander', capacidad_total: 42901 },
  { nombre: 'Deportivo Cali', capacidad_total: 42000 },
  { nombre: 'Olímpico Pascual Guerrero', capacidad_total: 37899 },
  { nombre: 'Nemesio Camacho El Campín', capacidad_total: 36343 },
  { nombre: 'Hernán Ramírez Villegas', capacidad_total: 30297 },
  { nombre: 'Palogrande', capacidad_total: 28678 },
  { nombre: 'Manuel Murillo Toro', capacidad_total: 28100 },
  { nombre: 'Américo Montanini', capacidad_total: 28000 },
  { nombre: 'Eduardo Santos', capacidad_total: 22000 },
  { nombre: 'Centenario de Armenia', capacidad_total: 20716 },
  { nombre: 'La Independencia', capacidad_total: 20630 },
  { nombre: 'Departamental Libertad', capacidad_total: 20000 },
  { nombre: 'Bello Horizonte - Rey Pelé', capacidad_total: 18000 },
  { nombre: 'Olímpico Jaime Morón León', capacidad_total: 16068 },
  { nombre: 'Sierra Nevada', capacidad_total: 16000 },
  { nombre: 'Doce de Octubre', capacidad_total: 16000 },
  { nombre: 'Francisco Rivera Escobar', capacidad_total: 15300 },
  { nombre: 'Luis Antonio Duque Peña', capacidad_total: 15000 },
  { nombre: 'Polideportivo Sur', capacidad_total: 14000 },
  { nombre: 'Estadio Alberto Grisales', capacidad_total: 14000 },
  { nombre: 'Jaraguay', capacidad_total: 12000 },
  { nombre: 'Guillermo Plazas Alcid', capacidad_total: 12000 },
  { nombre: 'Álvaro Gómez Hurtado', capacidad_total: 12000 },
  { nombre: 'Metropolitano de Itagüí (Ditaires)', capacidad_total: 12000 },
  { nombre: 'Tulio Ospina', capacidad_total: 12000 },
  { nombre: 'San José', capacidad_total: 12000 },
  { nombre: 'Alfonso López Pumarejo', capacidad_total: 12000 },
  { nombre: 'Orlando Losada Buendía', capacidad_total: 12000 },
  { nombre: 'Armando Maestre Pavajeau', capacidad_total: 11500 },
  { nombre: 'Daniel Villa Zapata', capacidad_total: 10400 },
  { nombre: 'Alberto Mora Mora', capacidad_total: 10000 },
  { nombre: 'Metropolitano de Techo', capacidad_total: 10000 },
  { nombre: 'John Jairo Tréllez', capacidad_total: 10000 },
  { nombre: 'Luis Fernando Montoya', capacidad_total: 10000 },
  { nombre: 'Santiago de las Atalayas', capacidad_total: 10000 },
  { nombre: 'Armando Tuirán Paternina', capacidad_total: 10000 },
  { nombre: 'Romelio Martínez', capacidad_total: 8600 },
  { nombre: 'Luis Carlos Galán Sarmiento', capacidad_total: 8000 },
  { nombre: 'Santa Ana', capacidad_total: 8000 },
  { nombre: 'Hernando Azcárate Martínez', capacidad_total: 8000 },
  { nombre: 'Antonio Roldan Betancourt', capacidad_total: 8000 },
  { nombre: 'Hermides Padilla', capacidad_total: 8000 },
  { nombre: 'Cortés Campomanes', capacidad_total: 8000 },
  { nombre: 'Federico Serrano Soto', capacidad_total: 7000 },
  { nombre: 'La Esperanza', capacidad_total: 7000 },
  { nombre: 'Parque Estadio Olaya Herrera', capacidad_total: 6500 },
  { nombre: 'Municipal de Santa Rosa de Cabal Arturo Arbeláez', capacidad_total: 6000 },
  { nombre: 'Villa Concha', capacidad_total: 5500 },
  { nombre: 'Municipal de Mosquera', capacidad_total: 5440 },
  { nombre: 'El Sol', capacidad_total: 5200 },
  { nombre: 'Santiago Santacruz Rambay', capacidad_total: 5000 },
  { nombre: 'Andrés Escobar', capacidad_total: 5000 },
  { nombre: 'Carlos Alberto Bernal', capacidad_total: 5000 },
  { nombre: 'Marcos Henríquez', capacidad_total: 5000 },
  { nombre: 'Estadio de Fútbol Venancio Pacheco', capacidad_total: 5000 },
  { nombre: 'Cacique Tundama', capacidad_total: 5000 },
  { nombre: 'Municipal Los Alpes', capacidad_total: 5000 },
  { nombre: 'El Vergel', capacidad_total: 5000 },
  { nombre: 'Alberto Buitrago Hoyos', capacidad_total: 5000 },
  { nombre: 'Pier Lora Muñoz', capacidad_total: 5000 },
  { nombre: 'Alberto Saibis Saker', capacidad_total: 5000 },
  { nombre: 'Municipal Villa de San Diego Ubaté', capacidad_total: 5000 },
  { nombre: 'Municipal Héctor El Zipa González', capacidad_total: 5000 },
  { nombre: 'Municipal de Ipiales', capacidad_total: 5000 },
  { nombre: 'Arturo Cumplido Sierra', capacidad_total: 5000 },
  { nombre: 'Municipal Julio Acosta Bernal', capacidad_total: 4600 },
  { nombre: 'Compensar', capacidad_total: 4500 },
  { nombre: 'Diego de Carvajal', capacidad_total: 4500 },
  { nombre: 'Miguel de Ibarra', capacidad_total: 4500 },
  { nombre: 'Yakinara', capacidad_total: 4500 },
  { nombre: 'James Britto Peláez', capacidad_total: 4500 },
  { nombre: 'Orlando Aníbal Monroy', capacidad_total: 4000 },
  { nombre: 'Municipal de Puerto Triunfo', capacidad_total: 4000 },
  { nombre: 'José María Hernández', capacidad_total: 4000 },
  { nombre: 'Municipal de Planeta Rica', capacidad_total: 4000 },
  { nombre: 'La Normal', capacidad_total: 3500 },
  { nombre: 'Jorge Torres Rocha', capacidad_total: 3500 },
  { nombre: 'Municipal Ariel González', capacidad_total: 3500 },
  { nombre: 'Hernando Urrea', capacidad_total: 3500 },
  { nombre: 'Marino Klinger', capacidad_total: 3500 },
  { nombre: 'Municipal Raúl Miranda', capacidad_total: 3500 },
  { nombre: 'Ciro López', capacidad_total: 3000 },
  { nombre: 'Fernando Mazuera Villegas', capacidad_total: 3000 },
  { nombre: 'Municipal de Ciénaga', capacidad_total: 3000 },
  { nombre: 'Municipal Chelo de Castro', capacidad_total: 3000 },
  { nombre: 'Grancolombiano', capacidad_total: 3000 },
  { nombre: 'Erwin O\'Neil', capacidad_total: 3000 },
  { nombre: 'Polideportivo El Cristal', capacidad_total: 3000 },
  { nombre: 'Francisco Ramos Pereira', capacidad_total: 2700 },
  { nombre: 'Cincuentenario', capacidad_total: 2500 },
  { nombre: 'Villa Olímpica de Chía', capacidad_total: 2500 },
  { nombre: 'Alberto Pava Londoño', capacidad_total: 2500 },
  { nombre: 'Domingo Tumaco González', capacidad_total: 2500 },
  { nombre: 'Cacique Jamundí', capacidad_total: 2500 },
  { nombre: 'Municipal de Cota', capacidad_total: 2300 },
  { nombre: 'Moderno Julio Torres', capacidad_total: 2000 },
  { nombre: 'Verdum', capacidad_total: 2000 },
  { nombre: 'Farid Díaz Rhenals', capacidad_total: 2000 },
  { nombre: 'Camilo Daza', capacidad_total: 2000 },
  { nombre: 'Municipal Ramón Rojas Herrera', capacidad_total: 2000 },
  { nombre: 'Rafael Castañeda Navarro', capacidad_total: 1900 },
  { nombre: 'El Campincito', capacidad_total: 1500 },
  { nombre: 'Alpidio Mejía', capacidad_total: 1500 },
  { nombre: 'Estadio Primero de Mayo', capacidad_total: 1500 },
  { nombre: 'Diego Palacios', capacidad_total: 1450 },
  { nombre: 'Unidad Deportiva Zona Sur', capacidad_total: 1450 },
  { nombre: 'Municipal Víctor Danilo Pacheco', capacidad_total: 1300 },
  { nombre: 'Lulio González', capacidad_total: 1000 },
  { nombre: 'Los Búcaros', capacidad_total: 1000 },
  { nombre: 'Campo Elías Terán Dix (San Fernando)', capacidad_total: 1000 },
  { nombre: 'Eduardo Orozco Mendoza - Dimenor', capacidad_total: 1000 },
  { nombre: 'Parque Estadio San Cristóbal', capacidad_total: 1000 },
  { nombre: 'La Libertad', capacidad_total: 1000 },
  { nombre: 'Daniel García Hernández', capacidad_total: 1000 },
  { nombre: 'Polisur', capacidad_total: 970 },
  { nombre: 'Municipal de Dosquebradas', capacidad_total: 700 },
  { nombre: 'Municipal de Mitú', capacidad_total: 500 },
  { nombre: 'Gustavo Calderón', capacidad_total: 320 },
  { nombre: 'Municipal de El Retiro', capacidad_total: null },
  { nombre: 'Estadio El Dorado', capacidad_total: null },
  { nombre: 'Municipal de Girardota', capacidad_total: null },
  { nombre: 'Municipal Jorge Eliecer Gaitán', capacidad_total: null },
  { nombre: 'Gabriel Cuesta', capacidad_total: null },
  { nombre: 'San Francisco', capacidad_total: null },
  { nombre: 'Atahualpa', capacidad_total: null },
  { nombre: 'Carlos Arturo Rueda', capacidad_total: null },
  { nombre: 'Tabora', capacidad_total: null },
  { nombre: 'José Maria Lajud', capacidad_total: null },
  { nombre: 'Primero de Septiembre', capacidad_total: null },
  { nombre: 'Estadio Guillermo Correa Claros', capacidad_total: null },
  { nombre: 'Pedro Antonio Zape', capacidad_total: null },
  { nombre: 'Fabricio Cabrera', capacidad_total: null },
  { nombre: 'Municipal Tigre Moyano', capacidad_total: null },
  { nombre: 'Municipal', capacidad_total: null },
  { nombre: 'Municipal Pachito Pallares', capacidad_total: null },
  { nombre: 'Municipal San José', capacidad_total: null },
  { nombre: 'Manuel Antonio Dávila', capacidad_total: null },
  { nombre: 'San Mateo', capacidad_total: null },
  { nombre: 'Municipal', capacidad_total: null },
  { nombre: 'Jesús Hermes Zambrano', capacidad_total: null },
  { nombre: 'Abel Osorio Restrepo', capacidad_total: null },
  { nombre: 'David Hughes', capacidad_total: null },
  { nombre: 'Isaías Olivar', capacidad_total: null },
  { nombre: 'Municipal La Reforma', capacidad_total: null },
  { nombre: 'Polideportivo Las Vegas', capacidad_total: 1500 },
  { nombre: 'Pedro Emilio Gil', capacidad_total: 1000 },
  { nombre: 'Municipal Noé Mazuera', capacidad_total: 600 }
];

const conectarDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB conectado');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    console.log('🗑️  Limpiando base de datos...');
    
    // Eliminar colecciones completamente (incluyendo índices)
    try {
      await mongoose.connection.db.dropCollection('estadios');
      await mongoose.connection.db.dropCollection('localidades');
      await mongoose.connection.db.dropCollection('sillas');
      await mongoose.connection.db.dropCollection('usuarios');
      await mongoose.connection.db.dropCollection('partidos');
      await mongoose.connection.db.dropCollection('boletas');
      await mongoose.connection.db.dropCollection('reservas');
      await mongoose.connection.db.dropCollection('pagos');
      console.log('✅ Colecciones eliminadas');
    } catch (err) {
      console.log('ℹ️  Algunas colecciones no existían');
    }

    console.log('🏟️  Insertando 149 estadios colombianos...');
    const estadiosCreados = await Estadio.insertMany(estadios);
    console.log(`✅ ${estadiosCreados.length} estadios creados`);

    // Crear usuarios de prueba
    console.log('👥 Creando usuarios...');
    const admin = await Usuario.create({
      nombre: 'Admin',
      email: 'admin@estadio.com',
      contraseña: 'admin123',
      rol: 'ADMIN'
    });

    const usuario = await Usuario.create({
      nombre: 'Juan Pérez',
      email: 'juan@email.com',
      contraseña: '123456',
      rol: 'AFICIONADO'
    });
    console.log('✅ Usuarios creados');

    // Usar primeros 5 estadios para crear localidades y partidos
    const estadiosPrincipales = estadiosCreados.slice(0, 5);
    
    console.log('🎫 Creando localidades...');
    for (const estadio of estadiosPrincipales) {
      const localidades = await Localidad.insertMany([
        { nombre: 'Norte', filas: 20, columnas: 30, precio_base: 50000, estadio: estadio._id },
        { nombre: 'Sur', filas: 20, columnas: 30, precio_base: 50000, estadio: estadio._id },
        { nombre: 'Oriental', filas: 15, columnas: 25, precio_base: 80000, estadio: estadio._id },
        { nombre: 'Occidental', filas: 15, columnas: 25, precio_base: 80000, estadio: estadio._id }
      ]);

      // Crear algunas sillas de ejemplo
      for (const localidad of localidades) {
        const sillas = [];
        for (let fila = 1; fila <= 3; fila++) {
          for (let col = 1; col <= 5; col++) {
            sillas.push({
              fila: fila,
              columna: col,
              localidad: localidad._id,
              estado: 'disponible'
            });
          }
        }
        await Silla.insertMany(sillas);
      }
    }
    console.log('✅ Localidades y sillas creadas');

    // Crear partidos de ejemplo
    console.log('⚽ Creando partidos...');
    const equipos = [
      ['Millonarios', 'Nacional'],
      ['América', 'Cali'],
      ['Junior', 'Santa Fe'],
      ['Medellín', 'Tolima'],
      ['Atlético Bucaramanga', 'Once Caldas']
    ];

    for (let i = 0; i < equipos.length; i++) {
      const fecha = new Date();
      fecha.setDate(fecha.getDate() + (i + 1) * 7);
      
      await Partido.create({
        equipo_local: equipos[i][0],
        equipo_visitante: equipos[i][1],
        fecha: fecha,
        hora: '19:00',
        estadio: estadiosPrincipales[i]._id,
        precio_base: 50000,
        estado: 'PROGRAMADO'
      });
    }
    console.log('✅ Partidos creados');

    console.log('\n✨ Base de datos poblada exitosamente\n');
    console.log('📊 Resumen:');
    console.log(`   • ${estadiosCreados.length} estadios`);
    console.log(`   • 2 usuarios (admin@estadio.com / admin123, juan@email.com / 123456)`);
    console.log(`   • 20 localidades`);
    console.log(`   • 300 sillas de ejemplo`);
    console.log(`   • 5 partidos`);

  } catch (error) {
    console.error('❌ Error poblando la base de datos:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Conexión cerrada');
  }
};

conectarDB().then(() => seedDatabase());
