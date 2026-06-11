import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ICartRepository } from '../../domain/cart.repository.port';

@Injectable()
export class RemoveCartItemUseCase {
  constructor(@Inject('ICartRepository') private readonly repo: ICartRepository) {}

  async execute(userId: string, productId: string) {
    try {
      return await this.repo.removeItem(userId, productId);
    } catch (error) {
      if ((error as Error).message === 'CART_NOT_FOUND') {
        throw new NotFoundException('Cart not found');
      }
      throw error;
    }
  }
}
