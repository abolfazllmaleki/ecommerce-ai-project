import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { RecommendationsModule } from './recommendations/recommendations.module';
import { CategoriesModule } from './categories/categories.module';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { ConfigModule ,ConfigService } from '@nestjs/config';
import { CommentsModule } from './comments/comments.module';
import { EmailModule } from './email/email.module';
import { RecaptchaModule } from './recaptcha/recaptcha.module';
import { ContactModule } from './contact/contact.module';
import { RedisModule } from './shared/infrastructure/redis/redis.module';
import { UploadModule } from './shared/cloudinary/upload.module';
import { MessagingModule } from './shared/messaging/messaging.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
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
    MessagingModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
