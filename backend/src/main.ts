
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security middleware
  app.use(helmet());
  app.use(cookieParser());

  // Allowed frontend origins
  const defaultOrigins = [
    'http://localhost:3000',
    'http://localhost:3002',
    'https://pg-mitra-sidd.vercel.app',
  ];

  const envOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map((origin) =>
        origin.trim().replace(/\/$/, ''),
      )
    : [];

  const allowedOrigins = Array.from(
    new Set([...defaultOrigins, ...envOrigins]),
  );

  // CORS configuration
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header, such as server-to-server requests.
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Origin not allowed by CORS'));
      }
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
    ],
  });

  // Request validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Render provides PORT; use 3001 locally.
  const port = Number(process.env.PORT) || 3001;

  await app.listen(port, '0.0.0.0');

  console.log(`PG Mitra backend running on port ${port}`);
  console.log('Allowed frontend origins:', allowedOrigins);
}

bootstrap();
