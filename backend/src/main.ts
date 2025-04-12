import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json } from 'express';
import { urlencoded } from 'express';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Fixed CORS configuration (removed trailing slashes)
  // app.enableCors({
  //   origin: [
  //     'https://ecommerce-ai-project-uhbj.vercel.app', // No trailing slash!
  //     'http://localhost:3000'
  //   ],
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  //   credentials: true
  // });
  app.enableCors({ origin: '*' });

  // Body parser configuration
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));

  // Port configuration optimized for Vercel
  const port = process.env.PORT || configService.get<number>('PORT') || 3000;
  
  // API prefix
  app.setGlobalPrefix('api');

  // Start server
  await app.listen(port);
  
  // Enhanced logging
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('CORS Origins:', [
    'https://ecommerce-ai-project-uhbj.vercel.app',
    'http://localhost:3000'
  ]);
}

// Simplified bootstrap call
bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});