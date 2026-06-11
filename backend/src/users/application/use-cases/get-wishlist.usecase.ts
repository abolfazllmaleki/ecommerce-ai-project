import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IUserRepository } from '../../domain/user.repository.port';
import { IProductRepository } from '../../../products/domain/product.repository.port';

@Injectable()
export class GetWishlistUseCase {
  constructor(
    @Inject('IUserRepository') private readonly userRepo: IUserRepository,
    @Inject('IProductRepository') private readonly productRepo: IProductRepository,
  ) {}

  async execute(userId: string): Promise<Record<string, unknown>[]> {
    try {
      const productIds = await this.userRepo.getWishlistProductIds(userId);
      const products = await Promise.all(
        productIds.map(id => this.productRepo.findById(id)),
      );

      return products
        .filter((p): p is NonNullable<typeof p> => !!p)
        .map(p => p.toPlainObject());
    } catch (error) {
      if ((error as Error).message === 'USER_NOT_FOUND') {
        throw new NotFoundException('User not found');
      }
      throw error;
    }
  }
}
