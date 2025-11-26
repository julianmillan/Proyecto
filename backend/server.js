import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import authRoutes from './routes/auth.routes.js';
import partidoRoutes from './routes/partido.routes.js';
import reservaRoutes from './routes/reserva.routes.js';
import usuarioRoutes from './routes/usuario.routes.js';
import adminRoutes from './routes/admin.routes.js';
import localidadRoutes from './routes/localidad.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Conectar a MongoDB
connectDB();

// Middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:4321',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/partidos', partidoRoutes);
app.use('/api', reservaRoutes);
app.use('/api/usuario', usuarioRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/localidades', localidadRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
});
