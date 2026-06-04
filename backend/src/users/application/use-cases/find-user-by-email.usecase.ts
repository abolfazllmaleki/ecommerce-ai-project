import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../../domain/user.repository.port';
import { User } from '../../domain/user.entity';

@Injectable()
export class FindUserByEmailUseCase {
  constructor(
    @Inject('IUserRepository') private readonly repo: IUserRepository,
  ) {}

  async execute(email: string): Promise<User | null> {
    return this.repo.findByEmail(email);
  }
}
