import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IUserRepository } from '../../domain/user.repository.port';
import { User } from '../../domain/user.entity';
import { IncrementProductFieldUseCase } from '../../../products/application/use-cases/increment-product-field.usecase';

@Injectable()
export class AddToWishlistUseCase {
  constructor(
    @Inject('IUserRepository') private readonly repo: IUserRepository,
    private readonly incrementProductField: IncrementProductFieldUseCase,
  ) {}

  async execute(userId: string, productId: string): Promise<User> {
    try {
      const user = await this.repo.addToWishlist(userId, productId);
      await this.incrementProductField.execute(productId, 'wishlistAdds');
      return user;
    } catch (error) {
      if ((error as Error).message === 'USER_NOT_FOUND') {
        throw new NotFoundException('User not found');
      }
      throw error;
    }
  }
}
