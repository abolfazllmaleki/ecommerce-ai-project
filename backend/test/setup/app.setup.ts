import { INestApplication, ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';

export function setupApp(app: INestApplication) {
  app.enableCors({
    origin: '*',
  });

  app.use(json({ limit: '10mb' }));

  app.use(
    urlencoded({
      extended: true,
      limit: '10mb',
    }),
  );

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
}