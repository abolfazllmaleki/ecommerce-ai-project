import { Inject, Injectable } from '@nestjs/common';
import { IProductRepository } from '../../domain/product.repository.port';
import { Product } from '../../domain/product.entity';
import { CreateProductDto } from '../../dto/create-product.dto';

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly repo: IProductRepository,
  ) {}

async execute(dto: CreateProductDto): Promise<Product> {
  const product = new Product({
    name: dto.name,
    price: dto.price,
    categoryId: dto.category,
    stock: dto.stock,
    description: dto.description,
    tags: dto.tags ?? [],
    brand: dto.brand,
    images: dto.images ?? [],
    colors: dto.colors ?? [],
    sizes: dto.sizes ?? [],
    discount: dto.discount ?? 0,
    isFeatured: dto.isFeatured ?? false,
  });

  return this.repo.create(product);
}

}
