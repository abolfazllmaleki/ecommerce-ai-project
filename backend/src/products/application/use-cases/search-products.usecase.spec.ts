import { BadRequestException } from '@nestjs/common';
import { SearchProductsUseCase } from './search-products.use-case';
import { IProductRepository } from '../../domain/product.repository.port';
import { CachePort } from '../../../shared/caching/application/ports/cache.port';
import { CacheVersionService } from '../../../shared/caching/infrastructure/redis/cache-version.service';

describe('SearchProductsUseCase', () => {
  let useCase: SearchProductsUseCase;
  let productRepository: jest.Mocked<IProductRepository>;
  let cache: jest.Mocked<CachePort>;
  let versionService: jest.Mocked<CacheVersionService>;

  beforeEach(() => {
    productRepository = {
      search: jest.fn(),
    } as unknown as jest.Mocked<IProductRepository>;

    cache = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
    } as unknown as jest.Mocked<CachePort>;

    versionService = {
      getProductsVersion: jest.fn().mockResolvedValue('v1'),
    } as unknown as jest.Mocked<CacheVersionService>;

    useCase = new SearchProductsUseCase(
      productRepository,
      cache,
      versionService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call productRepository.search with given params and cache the result', async () => {
    const params = {
      query: 'iphone',
      minPrice: 100,
      maxPrice: 1000,
      sortBy: 'price-asc' as const,
      limit: 10,
      page: 1,
    };

    const result = {
      items: [],
      total: 0,
      page: 1,
      limit: 10,
    };

    cache.get.mockResolvedValue(null);
    cache.set.mockResolvedValue(undefined);
    productRepository.search.mockResolvedValue(result);

    await expect(useCase.execute(params)).resolves.toEqual(result);

    expect(versionService.getProductsVersion).toHaveBeenCalledTimes(1);
    expect(cache.get).toHaveBeenCalledTimes(1);
    expect(productRepository.search).toHaveBeenCalledTimes(1);
    expect(productRepository.search).toHaveBeenCalledWith(params);
    expect(cache.set).toHaveBeenCalledTimes(1);
  });

  it('should return cached result when cache hit occurs', async () => {
    const params = {
      query: 'iphone',
      limit: 10,
      page: 1,
    };

    const cachedResult = {
      items: [
        {
          id: '1',
          name: 'iPhone',
        },
      ],
      total: 1,
      page: 1,
      limit: 10,
    };

    cache.get.mockResolvedValue(cachedResult);

    await expect(useCase.execute(params)).resolves.toEqual(cachedResult);

    expect(versionService.getProductsVersion).toHaveBeenCalledTimes(1);
    expect(cache.get).toHaveBeenCalledTimes(1);
    expect(productRepository.search).not.toHaveBeenCalled();
    expect(cache.set).not.toHaveBeenCalled();
  });

  it('should throw when minPrice is greater than maxPrice', async () => {
    await expect(
      useCase.execute({
        minPrice: 1000,
        maxPrice: 100,
      }),
    ).rejects.toThrow(BadRequestException);

    expect(productRepository.search).not.toHaveBeenCalled();
    expect(cache.get).not.toHaveBeenCalled();
    expect(cache.set).not.toHaveBeenCalled();
  });
});