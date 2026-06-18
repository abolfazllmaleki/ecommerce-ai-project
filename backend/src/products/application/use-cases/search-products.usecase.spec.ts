import { BadRequestException } from '@nestjs/common';
import { SearchProductsUseCase } from './search-products.use-case';
import { IProductRepository } from '../../domain/product.repository.port';

describe('SearchProductsUseCase', () => {
  let useCase: SearchProductsUseCase;
  let productRepository: jest.Mocked<IProductRepository>;

  beforeEach(() => {
    productRepository = {
      search: jest.fn(),
    } as unknown as jest.Mocked<IProductRepository>;

    useCase = new SearchProductsUseCase(productRepository);
  });

  it('should call productRepository.search with given params', async () => {
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

    productRepository.search.mockResolvedValue(result);

    await expect(useCase.execute(params)).resolves.toEqual(result);

    expect(productRepository.search).toHaveBeenCalledTimes(1);
    expect(productRepository.search).toHaveBeenCalledWith(params);
  });
  
  it('should throw when minPrice is greater than maxPrice', async () => {
  await expect(
    useCase.execute({
      minPrice: 1000,
      maxPrice: 100,
    }),
  ).rejects.toThrow(BadRequestException);

  expect(productRepository.search).not.toHaveBeenCalled();
});
});
