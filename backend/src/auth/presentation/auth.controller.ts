import {
  Body,
  Controller,
  Post,
  Param,
  HttpCode,
  HttpStatus,
  Get,
} from "@nestjs/common";

import { LoginUseCase } from "../application/use-cases/login.usecase";
import { RegisterUseCase } from "../application/use-cases/register.usecase";
import { ForgotPasswordUseCase } from "../application/use-cases/forgot-password.usecase";
import { ResetPasswordUseCase } from "../application/use-cases/reset-password.usecase";
import { ValidateResetTokenUseCase } from "../application/use-cases/validate-reset-token.usecase";

import { RegisterDto } from "../dtos/register.dto";
import { LoginDto } from "../dtos/login.dto";
import { ForgotPasswordDto } from "../dtos/forgot-password.dto";
import { ResetPasswordDto } from "../dtos/reset-password.dto";
import { AuthResponseDto } from "../dtos/auth-response.dto";

@Controller("auth")
export class AuthController {

  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
    private readonly validateResetTokenUseCase: ValidateResetTokenUseCase,
  ) {}

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() dto: RegisterDto,
  ): Promise<{ id: string; email: string }> {

    const user = await this.registerUseCase.execute(
      dto.name,
      dto.email,
      dto.password,
    );

    return {
      id: user.id!,
      email: user.email,
    };
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
  ): Promise<AuthResponseDto> {

    return this.loginUseCase.execute(
      dto.email,
      dto.password,
    );
  }

  @Post("forgot-password")
  @HttpCode(HttpStatus.ACCEPTED)
  async forgotPassword(
    @Body() dto: ForgotPasswordDto,
  ): Promise<{ message: string }> {

    await this.forgotPasswordUseCase.execute(dto.email);

    return {
      message: "If the email exists, a reset link has been sent.",
    };
  }

  @Post("reset-password")
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body() dto: ResetPasswordDto,
  ): Promise<{ message: string }> {

    await this.resetPasswordUseCase.execute(
      dto.token,
      dto.password,
    );

    return {
      message: "Password reset successfully.",
    };
  }

  @Get("reset-password/validate/:token")
  @HttpCode(HttpStatus.OK)
  async validateResetToken(
    @Param("token") token: string,
  ): Promise<{ valid: boolean }> {

    const user = await this.validateResetTokenUseCase.execute(token);

    return {
      valid: !!user,
    };
  }
}
