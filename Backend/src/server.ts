import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import { checkDatabaseConnection } from './config/database';
import { validateToken } from './middleware/auth';
import ticketRoutes from './routes/ticket.routes';

const app = express();

app.use(helmet());

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(morgan('dev'));
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'TicketFlow API' });
});

app.get('/api/private', validateToken, (req, res) => {
  res.json({
    message: '¡Acceso Autorizado! Tu token es válido.',
    user: req.user
  });
});

app.use('/api/tickets', ticketRoutes);

const startServer = async () => {
  await checkDatabaseConnection();

  app.listen(env.PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${env.PORT}`);
    console.log(`Entorno: ${env.NODE_ENV}`);
    console.log(`Seguridad: Validando tokens contra ${env.ISSUER}`);
  });
};

startServer();