import { Inject, Injectable } from '@nestjs/common';
import { ICartRepository } from '../../domain/cart.repository.port';

@Injectable()
export class GetCartUseCase {
  constructor(@Inject('ICartRepository') private readonly repo: ICartRepository) {}

  async execute(userId: string) {
    return this.repo.getCartPopulated(userId);
  }
}
