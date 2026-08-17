import { NotFoundException } from '@nestjs/common';
import { FindProductByIdUseCase } from './find-product-by-id.usecase';
import { IProductRepository } from '../../domain/product.repository.port';
import { CachePort } from '../../../shared/caching/application/ports/cache.port';
import { CacheVersionService } from '../../../shared/caching/infrastructure/redis/cache-version.service';
import { Product } from '../../domain/product.entity';

describe('FindProductByIdUseCase', () => {
  let useCase: FindProductByIdUseCase;
  let productRepository: jest.Mocked<IProductRepository>;
  let cache: jest.Mocked<CachePort>;
  let versionService: jest.Mocked<CacheVersionService>;

  beforeEach(() => {
    productRepository = {
      findById: jest.fn(),
    } as any;

    cache = {
      get: jest.fn(),
      set: jest.fn(),
    } as any;

    versionService = {
      getProductsVersion: jest.fn().mockResolvedValue(1),
    } as any;

    useCase = new FindProductByIdUseCase(
      productRepository,
      cache,
      versionService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should query the repository on a cache miss and cache the result', async () => {
    const product = {
      id: '1',
      name: 'iPhone',
    };

    cache.get.mockResolvedValue(null);
    cache.set.mockResolvedValue(undefined);
    productRepository.findById.mockResolvedValue(product as any);

    await expect(useCase.execute('1')).resolves.toEqual(product);

    expect(versionService.getProductsVersion).toHaveBeenCalledTimes(1);
    expect(cache.get).toHaveBeenCalledTimes(1);
    expect(productRepository.findById).toHaveBeenCalledWith('1');
    expect(cache.set).toHaveBeenCalledTimes(1);
    expect(cache.set).toHaveBeenCalledWith(expect.any(String), product, {
      ttlSeconds: 300,
    });
  });

  it('should return the rehydrated product on a cache hit without querying the repository', async () => {
    const cached = {
      id: '1',
      name: 'iPhone',
      categoryId: 'cat-1',
      price: 1000,
      stock: 5,
    };

    cache.get.mockResolvedValue(cached);

    const result = await useCase.execute('1');

    expect(result).toBeInstanceOf(Product);
    expect(result.id).toBe('1');
    expect(result.name).toBe('iPhone');

    expect(versionService.getProductsVersion).toHaveBeenCalledTimes(1);
    expect(cache.get).toHaveBeenCalledTimes(1);
    expect(productRepository.findById).not.toHaveBeenCalled();
    expect(cache.set).not.toHaveBeenCalled();
  });

  it('should throw NotFoundException when the product does not exist', async () => {
    cache.get.mockResolvedValue(null);
    productRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('missing')).rejects.toThrow(
      new NotFoundException('محصول مورد نظر یافت نشد'),
    );

    expect(cache.set).not.toHaveBeenCalled();
  });
});
