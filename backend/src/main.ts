
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import type { CorsOptions } from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security middleware
  app.use(helmet());
  app.use(cookieParser());

  // Default allowed frontend origins
  const defaultOrigins = [
    'http://localhost:3000',
    'http://localhost:3002',
    'https://pg-mitra-sidd.vercel.app',
    'https://adminmitra.vercel.app',
  ];

  // Additional origins from Render environment variables
  const envOrigins =
    process.env.ALLOWED_ORIGINS
      ?.split(',')
      .map((origin) => origin.trim().replace(/\/+$/, ''))
      .filter(Boolean) ?? [];

  const allowedOrigins = Array.from(
    new Set([...defaultOrigins, ...envOrigins]),
  );

  // CORS configuration
  const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
      // Allow requests without Origin (server-to-server requests)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.warn(`Blocked CORS origin: ${origin}`);
      return callback(new Error('Origin not allowed by CORS'));
    },

    credentials: true,

    methods: [
      'GET',
      'HEAD',
      'POST',
      'PUT',
      'PATCH',
      'DELETE',
      'OPTIONS',
    ],

    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
    ],

    optionsSuccessStatus: 204,
  };

  app.enableCors(corsOptions);

  // Request validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Render provides PORT automatically
  const port = Number(process.env.PORT) || 3001;

  await app.listen(port, '0.0.0.0');

  console.log(`PG Mitra backend running on port ${port}`);
  console.log('Allowed frontend origins:', allowedOrigins);
}

bootstrap().catch((error: unknown) => {
  console.error('Failed to start PG Mitra backend:', error);
  process.exit(1);
});
