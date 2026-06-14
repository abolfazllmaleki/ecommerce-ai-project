import { Inject, Injectable ,NotFoundException} from '@nestjs/common';
import { IProductRepository } from '../../domain/product.repository.port';
import { Product } from '../../domain/product.entity';
import { CachePort,CACHE_PORT} from '../../../shared/application/ports/cache.port';
import { CacheVersionService } from '../../../shared/infrastructure/redis/cache-version.service';
import { CacheKeyBuilder } from '../../../shared/infrastructure/redis/cache-key.builder';
import { CacheNamespaces } from '../../../shared/infrastructure/redis/cache.namespaces';



@Injectable()
export class GetFeaturedProductsUseCase {
  constructor(
    @Inject('IProductRepository') private readonly repo: IProductRepository,

    
    @Inject(CACHE_PORT)
    private readonly cache: CachePort,
    private readonly versionService: CacheVersionService,
  
  
  ) {}

 async execute(): Promise<Product[]> {

    const version = await this.versionService.getProductsVersion();

        const cacheKey = CacheKeyBuilder.build(
          CacheNamespaces.PRODUCT_LIST_FEATURED,
          version,
        );


        const cached = await this.cache.get<any[]>(cacheKey);

        if(cached){
          return cached.map(p => Product.rehydrate(p));
        }

    
        const products = await this.repo.getFeatured();

        if(!products.length){
        throw new NotFoundException('محصول مورد نظر یافت نشد');  
        }

            await this.cache.set(
              cacheKey,
              products.map(p => p.toPlainObject()),
              { ttlSeconds: 300 },
            );

        return products;
  }
}
