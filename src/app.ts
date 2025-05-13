import express, { Express } from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import hpp from 'hpp';
import errors from './middlewares/errors';
import cookieParser from 'cookie-parser';
import notFound from './middlewares/notFound';
import routes from './routes';
import swaggerUI from 'swagger-ui-express';
import swaggerSpec from './docs/config';

// Config Env Path
dotenv.config();

// Create App
const app: Express = express();

// CORS Options
const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  optionsSuccessStatus: 200,
  credentials: true,
};

// Middleware Setup
app.use(hpp());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));

// API Routes
app.use('/api', routes);
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// Not Found + Global Error Handler
app.use(notFound);
app.use(errors);


export default app;
