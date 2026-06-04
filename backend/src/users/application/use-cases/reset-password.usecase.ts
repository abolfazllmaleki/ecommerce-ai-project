import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IUserRepository } from '../../domain/user.repository.port';

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    @Inject('IUserRepository') private readonly repo: IUserRepository,
  ) {}

  async execute(token: string, hashedPassword: string): Promise<boolean> {
    try {
      return await this.repo.resetPassword(token, hashedPassword);
    } catch (error) {
      if ((error as Error).message === 'INVALID_RESET_TOKEN') {
        throw new NotFoundException('Invalid or expired reset token');
      }
      throw error;
    }
  }
}
