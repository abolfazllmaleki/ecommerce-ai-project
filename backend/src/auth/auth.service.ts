import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { BadRequestException } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<{ _id: string; email: string; role: string } | null> {
    const user = await this.usersService.findByEmail(email);

    if (user && (await bcrypt.compare(pass, user.password))) {
      return {
        _id: user._id as any,
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
    };
  }

  async register(createUserDto: CreateUserDto) {
    // Ensure no unexpected fields are being passed
    const { name, email, password } = createUserDto;

    // Check if user already exists
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    return this.usersService.create({
      name,
      email,
      password: hashedPassword,
    });
  }
}
