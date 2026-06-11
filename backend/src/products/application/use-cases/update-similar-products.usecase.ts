import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IProductRepository } from '../../domain/product.repository.port';
import { Product } from '../../domain/product.entity';

@Injectable()
export class UpdateSimilarProductsUseCase {
  constructor(@Inject('IProductRepository') private readonly repo: IProductRepository) {}

  async execute(id: string, similarProducts: string[]): Promise<Product> {
    const updated = await this.repo.updateSimilarProducts(id, similarProducts);
    if (!updated) throw new NotFoundException('محصول یافت نشد');
    return updated;
  }
}
