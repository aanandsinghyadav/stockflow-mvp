import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix — all routes become /api/auth, /api/products, etc.
  app.setGlobalPrefix('api');

  // CORS — allow frontend origins (set FRONTEND_URL env var in production)
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    process.env.FRONTEND_URL,        // e.g. https://stockflow-mvp.netlify.app
  ].filter(Boolean) as string[];

  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    credentials: true,
  });

  // Global validation pipe — runs class-validator on every DTO automatically
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,       // strip unknown fields from request body
      forbidNonWhitelisted: false,
      transform: true,       // auto-transform payloads to DTO class instances
    }),
  );

  // Global exception filter — consistent JSON error responses everywhere
  app.useGlobalFilters(new GlobalExceptionFilter());

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`StockFlow MVP backend running on http://localhost:${port}/api`);
}

bootstrap();
