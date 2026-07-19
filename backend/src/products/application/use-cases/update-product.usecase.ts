import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IProductRepository } from '../../domain/product.repository.port';
import { UpdateProductDto } from '../../dto/update-product.dto';
import { Product } from '../../domain/product.entity';
import {
  CACHE_INVALIDATOR_PORT,
  CacheInvalidatorPort,
} from '../../../shared/caching/application/ports/cache-invalidator.port';

@Injectable()
export class UpdateProductUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly repo: IProductRepository,

    @Inject(CACHE_INVALIDATOR_PORT)
    private readonly cacheInvalidator: CacheInvalidatorPort,
  ) {}

  async execute(id: string, dto: UpdateProductDto): Promise<Product> {
    const current = await this.repo.findById(id);

    if (!current) {
      throw new NotFoundException('محصول مورد نظر یافت نشد');
    }

    current.updateBasicInfo({
      name: dto.name,
      description: dto.description,
      brand: dto.brand,
      categoryId: dto.categoryId,
      tags: dto.tags,
      images: dto.images,
      colors: dto.colors,
      sizes: dto.sizes,
    });

    if (dto.price !== undefined) {
      current.updatePrice(dto.price);
    }

    if (dto.stock !== undefined) {
      current.updateStock(dto.stock);
    }

    const saved = await this.repo.update(current);

    if (!saved) {
      throw new NotFoundException('محصول مورد نظر یافت نشد');
    }

    // ✅ invalidate cache
    await this.cacheInvalidator.invalidateProduct(id);
    await this.cacheInvalidator.invalidateProductLists();

    return saved;
  }
}
