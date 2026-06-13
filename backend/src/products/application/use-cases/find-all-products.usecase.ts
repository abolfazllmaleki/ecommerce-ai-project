import { Inject, Injectable } from '@nestjs/common';
import { IProductRepository } from '../../domain/product.repository.port';
import { Product } from '../../domain/product.entity';


@Injectable()
export class FindAllProductsUseCase {
  constructor(
    @Inject('IProductRepository') private readonly repo: IProductRepository,
  ) {}

  async execute(): Promise<Product[]> {
    
    const products = await this.repo.findAll();

    return products;
  }
}
