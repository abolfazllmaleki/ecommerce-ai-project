import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
// import { Req } from '@nestjs/common/decorators';
import { Public } from './presentation/decorators/public.decorator';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { FindUserByResetTokenUseCase } from '../users/application/use-cases/find-user-by-reset-token.usecase';
import { Param } from '@nestjs/common/decorators';
import { BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

// Create a DTO that includes reCAPTCHA token for registration
class RegisterWithRecaptchaDto extends CreateUserDto {
  recaptchaToken: string;
}

// Create a DTO that includes reCAPTCHA token for login
class LoginWithRecaptchaDto extends LoginDto {
  recaptchaToken: string;
}

// Create a DTO that includes reCAPTCHA token for password reset
class ResetPasswordWithRecaptchaDto extends ResetPasswordDto {
  recaptchaToken: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly findUserByResetToken: FindUserByResetTokenUseCase,
    private readonly httpService: HttpService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterWithRecaptchaDto) {
    const isRecaptchaValid = await this.verifyRecaptcha(registerDto.recaptchaToken);
    
    if (!isRecaptchaValid) {
      return { success: false, message: 'reCAPTCHA verification failed' };
    }

    // Remove recaptchaToken from the DTO before passing to authService
    const { recaptchaToken, ...createUserDto } = registerDto;
    return this.authService.register(createUserDto);
  }

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginWithRecaptchaDto) {
    const isRecaptchaValid = await this.verifyRecaptcha(loginDto.recaptchaToken);
    
    if (!isRecaptchaValid) {
      return { success: false, message: 'reCAPTCHA verification failed' };
    }
    
    // Remove recaptchaToken and use local strategy
    const { recaptchaToken, ...credentials } = loginDto;
    return this.authService.validateUser(credentials.email, credentials.password)
      .then(user => {
        if (!user) {
          throw new BadRequestException('Invalid credentials');
        }
        return this.authService.login(user);
      });
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.ACCEPTED)
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    await this.authService.forgotPassword(forgotPasswordDto.email);
    return { 
      message: 'If the email exists, a password reset link has been sent' 
    };
  }

  @Public()
  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordWithRecaptchaDto) {
    const isRecaptchaValid = await this.verifyRecaptcha(resetPasswordDto.recaptchaToken);
    
    if (!isRecaptchaValid) {
      return { success: false, message: 'reCAPTCHA verification failed' };
    }
    
    // Remove recaptchaToken before passing to authService
    const { recaptchaToken, ...resetData } = resetPasswordDto;
    await this.authService.resetPasswordHandler(
      resetData.token,
      resetData.password,
    );
    return { message: 'Password reset successfully' };
  }

  @Public()
  @Post('validate-reset-token/:token')
  async validateResetToken(@Param('token') token: string) {
    const user = await this.findUserByResetToken.execute(token);

    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    return { valid: true, email: user.email };
  }

  private async verifyRecaptcha(token: string): Promise<boolean> {
    // For development, skip verification if using test key
    if (process.env.NODE_ENV === 'development') {
      console.log('Skipping reCAPTCHA verification in development mode');
      return true;
    }

    try {
      const secretKey = process.env.RECAPTCHA_SECRET_KEY;
      const response = await firstValueFrom(
        this.httpService.post(
          `https://www.google.com/recaptcha/api/siteverify`,
          null,
          {
            params: {
              secret: secretKey,
              response: token,
            },
          },
        ),
      );

      return response.data.success;
    } catch (error) {
      console.error('reCAPTCHA verification error:', error);
      return false;
    }
  }
}