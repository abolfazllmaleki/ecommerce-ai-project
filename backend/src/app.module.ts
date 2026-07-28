import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { RecommendationsModule } from './recommendations/recommendations.module';
import { CategoriesModule } from './categories/categories.module';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { CommentsModule } from './comments/comments.module';
import { EmailModule } from './email/email.module';
import { RecaptchaModule } from './recaptcha/recaptcha.module';
import { ContactModule } from './contact/contact.module';
import { RedisModule } from './shared/caching/infrastructure/redis/redis.module';
import { UploadModule } from './shared/cloudinary/upload.module';
import { MessagingModule } from './shared/messaging/messaging.module';
import { PaymentModule } from './payment/payment.module';
import { TransactionModule } from './transaction/transaction.module';

import { JwtAuthGuard } from './auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from './auth/presentation/guards/roles.guard';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
    }),

    UsersModule,
    ProductsModule,
    OrdersModule,
    RecommendationsModule,
    CategoriesModule,
    AuthModule,
    CartModule,
    CommentsModule,
    EmailModule,
    RecaptchaModule,
    ContactModule,
    RedisModule,
    UploadModule,
    MessagingModule,
    TransactionModule,
    PaymentModule,
  ],

  controllers: [AppController],

  providers: [
    AppService,
  ],
})
export class AppModule {}