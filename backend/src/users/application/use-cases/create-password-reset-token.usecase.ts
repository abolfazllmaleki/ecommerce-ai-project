import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../../domain/user.repository.port';

@Injectable()
export class CreatePasswordResetTokenUseCase {
  constructor(
    @Inject('IUserRepository') private readonly repo: IUserRepository,
  ) {}

  async execute(email: string): Promise<string | null> {
    return this.repo.createPasswordResetToken(email);
  }
}
