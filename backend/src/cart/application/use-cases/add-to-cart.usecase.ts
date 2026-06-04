import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ICartRepository } from '../../domain/cart.repository.port';
import { Cart } from '../../domain/cart.entity';
import { IProductRepository } from '../../../products/domain/product.repository.port';

@Injectable()
export class AddToCartUseCase {
  constructor(
    @Inject('ICartRepository') private readonly cartRepo: ICartRepository,
    @Inject('IProductRepository') private readonly productRepo: IProductRepository,
  ) {}

  async execute(userId: string, productId: string) {
    const product = await this.productRepo.findById(productId);
    if (!product) throw new NotFoundException('Product not found');

    let cart = await this.cartRepo.findByUserId(userId);
    if (!cart) {
      cart = new Cart({ userId, items: [], total: 0 });
    }

    cart.addItem(productId, product.price);
    return this.cartRepo.save(cart);
  }
}
