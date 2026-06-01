import { Inject, Injectable } from '@nestjs/common';
import { IProductRepository } from '../../domain/product.repository.port';
import { Product } from '../../domain/product.entity';

@Injectable()
export class GetRelatedProductsUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly repo: IProductRepository,
  ) {}

  async execute(id: string, limit = 10): Promise<Product[]> {
    const safeLimit = Math.max(limit ?? 10, 1);
    return this.repo.getRelated(id, safeLimit);
  }
}
