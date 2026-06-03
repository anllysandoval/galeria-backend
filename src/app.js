import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import ratelimit from 'express-rate-limit';

dotenv.config();

console.log('BackEnd:', process.env.BASE_URL_BACKEND);

import userRoutes from './routes/user.routes.js';
import artworkRoutes from './routes/artwork.routes.js';
import cartRoutes from './routes/cart.routes.js';
import orderRoutes from './routes/order.routes.js';

const app = express();

const limiter = ratelimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(helmet());
app.use(limiter);
app.use(
  cors({
    origin: [process.env.BASE_URL_BACKEND, process.env.BASE_URL_FRONTEND],
    credentials: true,
  })
);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/user', userRoutes);
app.use('/api/artworks', artworkRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/order', orderRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenido al API REST de Galería de Arte',
    version: '1.0.0',
    rutasDisponibles: [
      { endpoint: '/api/artworks', method: 'GET', description: 'Listar obras (público)' },
      { endpoint: '/api/artworks/categories', method: 'GET', description: 'Listar categorías (público)' },
      { endpoint: '/api/artworks/:id', method: 'GET', description: 'Detalle de obra (público)' },
      { endpoint: '/api/artworks', method: 'POST', description: 'Crear obra (admin)' },
      { endpoint: '/api/user', method: 'POST', description: 'Crear/sincronizar usuario Auth0' },
      { endpoint: '/api/cart', method: 'GET', description: 'Obtener carrito del usuario' },
    ],
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'GaleriaArte API se está ejecutando correctamente',
  });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Ruta no encontrada' });
});

export default app;
