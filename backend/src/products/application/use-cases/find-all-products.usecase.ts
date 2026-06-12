// import { Inject, Injectable } from '@nestjs/common';
// import { IProductRepository } from '../../domain/product.repository.port';
// import { Product } from '../../domain/product.entity';
// import { CachePort } from '../../../shared/application/ports/cache.port';
// import { CACHE_PORT } from '../../../shared/application/ports/cache.port';
// @Injectable()
// export class FindAllProductsUseCase {
//   constructor(
//     @Inject('IProductRepository') private readonly repo: IProductRepository,

//     @Inject(CACHE_PORT)
//     private readonly cache: CachePort
//   ) {}

//   execute(): Promise<Product[]> {
//     return this.repo.findAll();
//   }
// }
import { Inject, Injectable } from '@nestjs/common';
import { IProductRepository } from '../../domain/product.repository.port';
import { Product } from '../../domain/product.entity';
import { CacheKeyBuilder } from '../../../shared/infrastructure/redis/cache-key.builder';
import { CacheNamespaces } from '../../../shared/infrastructure/redis/cache.namespaces';
import { CachePort } from '../../../shared/application/ports/cache.port';
import { CACHE_PORT } from '../../../shared/application/ports/cache.port';

@Injectable()
export class FindAllProductsUseCase {
  constructor(
    @Inject('IProductRepository') private readonly repo: IProductRepository,

    @Inject(CACHE_PORT)
    private readonly cache: CachePort
  ) {}

  // ۱. متد باید async باشد چون عملیات Redis و DB هر دو I/O bound هستند
  async execute(): Promise<Product[]> {
    
    // ۲. تولید کلید کش با استفاده از استراتژی namespace
    // اینجا چون پارامتر نداریم، خودِ builder به درستی فقط namespace و version را ترکیب می‌کند
    const cacheKey = CacheKeyBuilder.build(CacheNamespaces.PRODUCTS_LIST);

    // ۳. تلاش برای گرفتن داده از کش (Cache-Aside Pattern)
    const cachedProducts = await this.cache.get<Product[]>(cacheKey);

    if (cachedProducts) {
      console.log('CACHE HIT');
      return cachedProducts;
    }
    console.log('CACHE MISS');
    // ۴. Cache Miss: دیتابیس را صدا می‌زنیم
    const products = await this.repo.findAll();

    // ۵. ذخیره در کش برای درخواست‌های بعدی
    // TTL مناسب برای لیست محصولات (مثلاً ۶۰ ثانیه)
    await this.cache.set(cacheKey, products, { ttlSeconds: 60 });

    return products;
  }
}
