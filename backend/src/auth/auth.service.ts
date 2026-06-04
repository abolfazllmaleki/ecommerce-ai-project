import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { EmailService } from '../email/email.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserRole } from '../users/domain/user.entity';
import { CreateUserUseCase } from '../users/application/use-cases/create-user.usecase';
import { FindUserByEmailUseCase } from '../users/application/use-cases/find-user-by-email.usecase';
import { FindUserByIdUseCase } from '../users/application/use-cases/find-user-by-id.usecase';
import { UpdatePasswordUseCase } from '../users/application/use-cases/update-password.usecase';
import { CreatePasswordResetTokenUseCase } from '../users/application/use-cases/create-password-reset-token.usecase';
import { ResetPasswordUseCase } from '../users/application/use-cases/reset-password.usecase';
import { FindUserByResetTokenUseCase } from '../users/application/use-cases/find-user-by-reset-token.usecase';

@Injectable()
export class AuthService {
  constructor(
    private readonly createUser: CreateUserUseCase,
    private readonly findUserByEmail: FindUserByEmailUseCase,
    private readonly findUserById: FindUserByIdUseCase,
    private readonly updatePassword: UpdatePasswordUseCase,
    private readonly createPasswordResetToken: CreatePasswordResetTokenUseCase,
    private readonly resetPassword: ResetPasswordUseCase,
    private readonly findUserByResetToken: FindUserByResetTokenUseCase,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<{ _id: string; email: string; role: UserRole } | null> {
    const user = await this.findUserByEmail.execute(email);

    if (user && (await bcrypt.compare(pass, user.password))) {
      return {
        _id: user.id as string,
        email: user.email,
        role: user.role,
      };
    }
    return null;
  }

  async validateUserById(userId: string) {
    const user = await this.findUserById.execute(userId);
    return user ? user.toPlainObject() : null;
  }

  async login(user: any) {
    if (!user._id || !user.role) {
      throw new Error('User ID or role is missing from database query');
    }

    const payload = {
      email: user.email,
      sub: user._id.toString(),
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async register(createUserDto: CreateUserDto) {
    const { name, email, password, role = UserRole.USER } = createUserDto;

    if (role && !Object.values(UserRole).includes(role as UserRole)) {
      throw new BadRequestException('Invalid role specified');
    }

    const existingUser = await this.findUserByEmail.execute(email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    return this.createUser.execute({
      name,
      email,
      password: hashedPassword,
      role: role as UserRole,
      isEmailVerified: false,
      verificationToken: uuidv4(),
    });
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await this.findUserById.execute(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isOldPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    await this.updatePassword.execute(userId, hashedNewPassword);

    return { message: 'Password updated successfully' };
  }

  async forgotPassword(email: string): Promise<void> {
    const resetToken = await this.createPasswordResetToken.execute(email);

    if (resetToken) {
      await this.emailService.sendPasswordResetEmail(email, resetToken);
    }
  }

  async resetPasswordHandler(token: string, newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    const success = await this.resetPassword.execute(token, hashedPassword);

    if (success) {
      const user = await this.findUserByResetToken.execute(token);
      if (user) {
        await this.emailService.sendPasswordResetConfirmation(user.email);
      }
    }
  }
}
