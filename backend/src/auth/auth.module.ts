import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersService } from 'src/users/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schemas/user.schema';
import { LocalStrategy } from './strategies/local.strategy';
import { ProductsModule } from 'src/products/products.module';
@Module({
  imports: [
    UsersModule,
    ProductsModule,
    PassportModule,
    JwtModule.register({
      secret: 'your-secure-secret-key',
      signOptions: { expiresIn: '1h' },
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, UsersService, LocalStrategy],
  exports: [AuthService, UsersService],
})
export class AuthModule {}
