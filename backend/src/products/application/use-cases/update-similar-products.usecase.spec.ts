import { NotFoundException } from '@nestjs/common';
import { UpdateSimilarProductsUseCase } from './update-similar-products.usecase';
import { IProductRepository } from '../../domain/product.repository.port';

describe('UpdateSimilarProductsUseCase', () => {
  let useCase: UpdateSimilarProductsUseCase;
  let productRepository: jest.Mocked<IProductRepository>;

  beforeEach(() => {
    productRepository = {
      updateSimilarProducts: jest.fn(),
    } as any;

    useCase = new UpdateSimilarProductsUseCase(productRepository);
  });

  it('should update similar products and return the updated product', async () => {
    const id = '1';
    const similarProducts = ['2', '3'];

    const updated = {
      id: '1',
      similarProducts: ['2', '3'],
    };

    productRepository.updateSimilarProducts.mockResolvedValue(updated as any);

    await expect(useCase.execute(id, similarProducts)).resolves.toEqual(
      updated,
    );

    expect(productRepository.updateSimilarProducts).toHaveBeenCalledTimes(1);
    expect(productRepository.updateSimilarProducts).toHaveBeenCalledWith(
      id,
      similarProducts,
    );
  });

  it('should throw NotFoundException when the product does not exist', async () => {
    productRepository.updateSimilarProducts.mockResolvedValue(null);

    await expect(useCase.execute('missing', ['2'])).rejects.toThrow(
      new NotFoundException('محصول یافت نشد'),
    );
  });
});
