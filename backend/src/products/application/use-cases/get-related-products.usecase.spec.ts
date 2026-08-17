import { GetRelatedProductsUseCase } from './get-related-products.usecase';
import { IProductRepository } from '../../domain/product.repository.port';
import { CachePort } from '../../../shared/caching/application/ports/cache.port';
import { CacheVersionService } from '../../../shared/caching/infrastructure/redis/cache-version.service';
import { Product } from '../../domain/product.entity';

describe('GetRelatedProductsUseCase', () => {
  let useCase: GetRelatedProductsUseCase;
  let productRepository: jest.Mocked<IProductRepository>;
  let cache: jest.Mocked<CachePort>;
  let versionService: jest.Mocked<CacheVersionService>;

  beforeEach(() => {
    productRepository = {
      getRelated: jest.fn(),
    } as any;

    cache = {
      get: jest.fn(),
      set: jest.fn(),
    } as any;

    versionService = {
      getProductsVersion: jest.fn().mockResolvedValue(1),
    } as any;

    useCase = new GetRelatedProductsUseCase(
      productRepository,
      cache,
      versionService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should query the repository with the default limit on a cache miss and cache the plain objects', async () => {
    const plain = { id: '2', name: 'Related' };
    const product = { toPlainObject: jest.fn().mockReturnValue(plain) };
    const products = [product];

    cache.get.mockResolvedValue(null);
    cache.set.mockResolvedValue(undefined);
    productRepository.getRelated.mockResolvedValue(products as any);

    await expect(useCase.execute('1')).resolves.toEqual(products);

    expect(versionService.getProductsVersion).toHaveBeenCalledTimes(1);
    expect(cache.get).toHaveBeenCalledTimes(1);
    expect(productRepository.getRelated).toHaveBeenCalledWith('1', 10);
    expect(product.toPlainObject).toHaveBeenCalledTimes(1);
    expect(cache.set).toHaveBeenCalledWith(expect.any(String), [plain], {
      ttlSeconds: 300,
    });
  });

  it('should forward a custom limit to the repository', async () => {
    cache.get.mockResolvedValue(null);
    cache.set.mockResolvedValue(undefined);
    productRepository.getRelated.mockResolvedValue([]);

    await useCase.execute('1', 3);

    expect(productRepository.getRelated).toHaveBeenCalledWith('1', 3);
  });

  it('should clamp a non-positive limit to at least 1', async () => {
    cache.get.mockResolvedValue(null);
    cache.set.mockResolvedValue(undefined);
    productRepository.getRelated.mockResolvedValue([]);

    await useCase.execute('1', 0);

    expect(productRepository.getRelated).toHaveBeenCalledWith('1', 1);
  });

  it('should return the rehydrated products on a cache hit without querying the repository', async () => {
    const cached = [
      {
        id: '2',
        name: 'Related',
        categoryId: 'cat-1',
        price: 100,
        stock: 1,
      },
    ];

    cache.get.mockResolvedValue(cached);

    const result = await useCase.execute('1');

    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(Product);
    expect(result[0].id).toBe('2');

    expect(cache.get).toHaveBeenCalledTimes(1);
    expect(productRepository.getRelated).not.toHaveBeenCalled();
    expect(cache.set).not.toHaveBeenCalled();
  });
});
