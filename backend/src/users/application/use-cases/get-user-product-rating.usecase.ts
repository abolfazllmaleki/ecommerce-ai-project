import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  IUserRepository,
  UserProductRatingResult,
} from '../../domain/user.repository.port';

@Injectable()
export class GetUserProductRatingUseCase {
  constructor(
    @Inject('IUserRepository') private readonly repo: IUserRepository,
  ) {}

  async execute(
    userId: string,
    productId: string,
  ): Promise<UserProductRatingResult> {
    try {
      return await this.repo.getUserProductRating(userId, productId);
    } catch (error) {
      if ((error as Error).message === 'USER_NOT_FOUND') {
        throw new NotFoundException('User not found');
      }
      throw error;
    }
  }
}
