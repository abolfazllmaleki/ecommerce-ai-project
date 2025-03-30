import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json } from 'express';
import { urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // فعال کردن CORS برای تمامی دامنه‌ها (برای تست محلی مفید است)
  app.enableCors();
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));

  await app.listen(3000);
}
bootstrap();
