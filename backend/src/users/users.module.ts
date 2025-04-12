import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserSchema } from './schemas/user.schema';
import { ProductsModule } from '../products/products.module';
@Module({
  imports: [
    // ثبت مدل با نام 'User' برای استفاده در سرویس
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    ProductsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
