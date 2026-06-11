import { Inject, Injectable } from '@nestjs/common';
import { IProductRepository } from '../../domain/product.repository.port';
import { Product } from '../../domain/product.entity';

@Injectable()
export class GetFeaturedProductsUseCase {
  constructor(@Inject('IProductRepository') private readonly repo: IProductRepository) {}

  execute(): Promise<Product[]> {
    return this.repo.getFeatured();
  }
}
