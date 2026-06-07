import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { IUserRepository } from 'src/users/domain/user.repository.port';
import { User, UserRole } from 'src/users/domain/user.entity';
import { PasswordHasherPort } from '../../domain/services/password-hasher.port';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepo: IUserRepository,

    @Inject('PasswordHasherPort')
    private readonly hasher: PasswordHasherPort,
  ) {}

  async execute(name: string, email: string, password: string) {
    const exists = await this.userRepo.findByEmail(email);

    if (exists) {
      throw new ConflictException('User already exists');
    }

    const hashed = await this.hasher.hash(password);

    const user = new User({
      id: uuid(),
      name,
      email,
      password: hashed,
      role: UserRole.USER,
    });

    return this.userRepo.create(user);
  }
}
