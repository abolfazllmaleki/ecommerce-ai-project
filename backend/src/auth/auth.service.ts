import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User, UserRole } from '../users/schemas/user.schema';
import { v4 as uuidv4 } from 'uuid';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<{ _id: string; email: string; role: UserRole } | null> {
    const user = await this.usersService.findByEmail(email);

    if (user && (await bcrypt.compare(pass, user.password))) {
      return {
        _id: (user._id as any).toString(), // Fix the _id type issue
        email: user.email,
        role: user.role,
      };
    }
    return null;
  }

  async validateUserById(userId: string): Promise<User | null> {
    return this.usersService.findOne(userId);
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
      }
    };
  }

  async register(createUserDto: CreateUserDto) {
    const { name, email, password, role = UserRole.USER } = createUserDto;

    // Validate role if provided (convert string to enum if needed)
    if (role && !Object.values(UserRole).includes(role as UserRole)) {
      throw new BadRequestException('Invalid role specified');
    }

    // Check if user already exists
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user with hashed password - use proper typing
    const userData: any = {
      name,
      email,
      password: hashedPassword,
      role: role as UserRole,
      isEmailVerified: false,
      verificationToken: uuidv4(),
    };

    return this.usersService.create(userData);
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await this.usersService.findOne(userId);
    
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    
    if (!isOldPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    await this.usersService.updatePassword(userId, hashedNewPassword);

    return { message: 'Password updated successfully' };
  }

  async forgotPassword(email: string): Promise<void> {
    const resetToken = await this.usersService.createPasswordResetToken(email);
    
    if (resetToken) {
      await this.emailService.sendPasswordResetEmail(email, resetToken);
    }

    // Always return success to prevent email enumeration
    return;
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const success = await this.usersService.resetPassword(token, newPassword);
    
    if (success) {
      // Optionally send confirmation email
      const user = await this.usersService.findByResetToken(token);
      if (user) {
        await this.emailService.sendPasswordResetConfirmation(user.email);
      }
    }
  }
}