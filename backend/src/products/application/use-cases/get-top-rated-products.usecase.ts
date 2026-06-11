import { Inject, Injectable } from '@nestjs/common';
import { IProductRepository } from '../../domain/product.repository.port';
import { Product } from '../../domain/product.entity';

@Injectable()
export class GetTopRatedProductsUseCase {
  constructor(@Inject('IProductRepository') private readonly repo: IProductRepository) {}

  execute(limit = 6): Promise<Product[]> {
    return this.repo.getTopRated(limit);
  }
}
