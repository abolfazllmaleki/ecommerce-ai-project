import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json } from 'express';
import { urlencoded } from 'express';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors({
    origin: [
      'https://your-project.vercel.app',
      'http://localhost:3000'
    ]
  });
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));

  const port = configService.get<number>('PORT') || 3000;
  app.setGlobalPrefix('api');
  await app.listen(port);
  
  console.log(`Application is running on: ${await app.getUrl()}`);
}

if (process.env.NODE_ENV === 'production') {
  bootstrap().then(() => {
    console.log('NestJS running on Vercel');
  });
} else {
  bootstrap();
}