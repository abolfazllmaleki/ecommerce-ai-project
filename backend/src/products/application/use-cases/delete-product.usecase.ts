import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IProductRepository } from '../../domain/product.repository.port';
import {
  CACHE_INVALIDATOR_PORT,
  CacheInvalidatorPort,
} from '../../../shared/application/ports/cache-invalidator.port';
@Injectable()
export class DeleteProductUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly repo: IProductRepository,

    @Inject(CACHE_INVALIDATOR_PORT)
    private readonly cacheInvalidator: CacheInvalidatorPort,
  ) {}

  async execute(id: string): Promise<void> {
    const ok = await this.repo.delete(id);

    if (!ok) {
      throw new NotFoundException('محصول مورد نظر یافت نشد');
    }

    await this.cacheInvalidator.invalidateProduct(id);
  }
}
