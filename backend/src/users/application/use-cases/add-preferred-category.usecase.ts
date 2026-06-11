import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IUserRepository } from '../../domain/user.repository.port';
import { User } from '../../domain/user.entity';

@Injectable()
export class AddPreferredCategoryUseCase {
  constructor(
    @Inject('IUserRepository') private readonly repo: IUserRepository,
  ) {}

  async execute(userId: string, category: string): Promise<User> {
    try {
      return await this.repo.addPreferredCategory(userId, category);
    } catch (error) {
      if ((error as Error).message === 'USER_NOT_FOUND') {
        throw new NotFoundException('User not found');
      }
      throw error;
    }
  }
}
