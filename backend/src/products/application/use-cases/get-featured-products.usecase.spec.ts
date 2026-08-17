import { NotFoundException } from '@nestjs/common';
import { GetFeaturedProductsUseCase } from './get-featured-products.usecase';
import { IProductRepository } from '../../domain/product.repository.port';
import { CachePort } from '../../../shared/caching/application/ports/cache.port';
import { CacheVersionService } from '../../../shared/caching/infrastructure/redis/cache-version.service';
import { Product } from '../../domain/product.entity';

describe('GetFeaturedProductsUseCase', () => {
  let useCase: GetFeaturedProductsUseCase;
  let productRepository: jest.Mocked<IProductRepository>;
  let cache: jest.Mocked<CachePort>;
  let versionService: jest.Mocked<CacheVersionService>;

  beforeEach(() => {
    productRepository = {
      getFeatured: jest.fn(),
    } as any;

    cache = {
      get: jest.fn(),
      set: jest.fn(),
    } as any;

    versionService = {
      getProductsVersion: jest.fn().mockResolvedValue(1),
    } as any;

    useCase = new GetFeaturedProductsUseCase(
      productRepository,
      cache,
      versionService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should query the repository on a cache miss and cache the plain objects', async () => {
    const plain = { id: '1', name: 'Featured' };
    const product = { toPlainObject: jest.fn().mockReturnValue(plain) };
    const products = [product];

    cache.get.mockResolvedValue(null);
    cache.set.mockResolvedValue(undefined);
    productRepository.getFeatured.mockResolvedValue(products as any);

    await expect(useCase.execute()).resolves.toEqual(products);

    expect(versionService.getProductsVersion).toHaveBeenCalledTimes(1);
    expect(cache.get).toHaveBeenCalledTimes(1);
    expect(productRepository.getFeatured).toHaveBeenCalledTimes(1);
    expect(product.toPlainObject).toHaveBeenCalledTimes(1);
    expect(cache.set).toHaveBeenCalledWith(expect.any(String), [plain], {
      ttlSeconds: 300,
    });
  });

  it('should return the rehydrated products on a cache hit without querying the repository', async () => {
    const cached = [
      {
        id: '1',
        name: 'Featured',
        categoryId: 'cat-1',
        price: 100,
        stock: 1,
      },
    ];

    cache.get.mockResolvedValue(cached);

    const result = await useCase.execute();

    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(Product);
    expect(result[0].id).toBe('1');

    expect(cache.get).toHaveBeenCalledTimes(1);
    expect(productRepository.getFeatured).not.toHaveBeenCalled();
    expect(cache.set).not.toHaveBeenCalled();
  });

  it('should throw NotFoundException when there are no featured products', async () => {
    cache.get.mockResolvedValue(null);
    productRepository.getFeatured.mockResolvedValue([]);

    await expect(useCase.execute()).rejects.toThrow(
      new NotFoundException('محصول مورد نظر یافت نشد'),
    );

    expect(cache.set).not.toHaveBeenCalled();
  });
});
