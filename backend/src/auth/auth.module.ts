import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthController } from './presentation/auth.controller';

import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { LocalStrategy } from './infrastructure/strategies/local.strategy';

import { UsersModule } from '../users/users.module';

import { BcryptService } from './infrastructure/services/bcrypt.service';
import { JwtTokenService } from './infrastructure/services/jwt-token.service';
import { RecaptchaService } from './infrastructure/services/recaptcha.service';

import { RegisterUseCase } from './application/use-cases/register.usecase';
import { LoginUseCase } from './application/use-cases/login.usecase';
import { ForgotPasswordUseCase } from './application/use-cases/forgot-password.usecase';
import { ResetPasswordUseCase } from './application/use-cases/reset-password.usecase';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    RegisterUseCase,
    LoginUseCase,
    ForgotPasswordUseCase,
    ResetPasswordUseCase,

    BcryptService,
    JwtTokenService,
    RecaptchaService,

    LocalStrategy,
    JwtStrategy,

    {
      provide: 'PasswordHasherPort',
      useExisting: BcryptService,
    },
    {
      provide: 'TokenProviderPort',
      useExisting: JwtTokenService,
    },
    {
      provide: 'RecaptchaVerifierPort',
      useExisting: RecaptchaService,
    },
  ],
})
export class AuthModule {}

