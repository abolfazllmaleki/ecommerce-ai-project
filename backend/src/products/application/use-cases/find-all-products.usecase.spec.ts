import { FindAllProductsUseCase } from './find-all-products.usecase';
import { IProductRepository } from '../../domain/product.repository.port';

describe('FindAllProductsUseCase', () => {
  let useCase: FindAllProductsUseCase;
  let productRepository: jest.Mocked<IProductRepository>;

  beforeEach(() => {
    productRepository = {
      findAll: jest.fn(),
    } as any;

    useCase = new FindAllProductsUseCase(productRepository);
  });

  it('should return all products from the repository', async () => {
    const products = [{ id: '1' }, { id: '2' }];

    productRepository.findAll.mockResolvedValue(products as any);

    await expect(useCase.execute()).resolves.toEqual(products);

    expect(productRepository.findAll).toHaveBeenCalledTimes(1);
    expect(productRepository.findAll).toHaveBeenCalledWith();
  });

  it('should return an empty array when there are no products', async () => {
    productRepository.findAll.mockResolvedValue([]);

    await expect(useCase.execute()).resolves.toEqual([]);
    expect(productRepository.findAll).toHaveBeenCalledTimes(1);
  });
});
