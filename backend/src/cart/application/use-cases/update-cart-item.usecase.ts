import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ICartRepository } from '../../domain/cart.repository.port';

@Injectable()
export class UpdateCartItemUseCase {
  constructor(@Inject('ICartRepository') private readonly repo: ICartRepository) {}

  async execute(userId: string, productId: string, quantity: number) {
    try {
      return await this.repo.updateItemQuantity(userId, productId, quantity);
    } catch (error) {
      if ((error as Error).message === 'CART_ITEM_NOT_FOUND') {
        throw new NotFoundException('Cart item not found');
      }
      throw error;
    }
  }
}
