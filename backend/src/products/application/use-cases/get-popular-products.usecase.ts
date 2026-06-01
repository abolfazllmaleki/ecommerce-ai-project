import { Inject, Injectable } from '@nestjs/common';
import { IProductRepository } from '../../domain/product.repository.port';
import { Product } from '../../domain/product.entity';

@Injectable()
export class GetPopularProductsUseCase {
  constructor(@Inject('IProductRepository') private readonly repo: IProductRepository) {}

  execute(limit = 10): Promise<Product[]> {
    return this.repo.getPopular(limit);
  }
}
