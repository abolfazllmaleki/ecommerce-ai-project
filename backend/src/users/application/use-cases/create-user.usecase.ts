import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { IUserRepository } from '../../domain/user.repository.port';
import { User } from '../../domain/user.entity';
import { CreateUserDto } from '../../dto/create-user.dto';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('IUserRepository') private readonly repo: IUserRepository,
  ) {}

  async execute(dto: CreateUserDto): Promise<User> {
    try {
      const user = new User({
        name: dto.name,
        email: dto.email,
        password: dto.password,
        role: dto.role,
        isEmailVerified: dto.isEmailVerified,
        verificationToken: dto.verificationToken,
      });
      return await this.repo.create(user);
    } catch {
      throw new InternalServerErrorException('Error creating user');
    }
  }
}
