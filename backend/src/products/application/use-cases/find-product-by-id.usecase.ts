import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IProductRepository } from '../../domain/product.repository.port';
import { Product } from '../../domain/product.entity';

@Injectable()
export class FindProductByIdUseCase {
  constructor(@Inject('IProductRepository') private readonly repo: IProductRepository) {}

  async execute(id: string): Promise<Product> {
    const product = await this.repo.findById(id);
    if (!product) throw new NotFoundException('محصول مورد نظر یافت نشد');
    return product;
  }
}
