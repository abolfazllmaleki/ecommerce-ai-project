import { NotFoundException } from '@nestjs/common';
import { DeleteProductUseCase } from './delete-product.usecase';
import { IProductRepository } from '../../domain/product.repository.port';
import { CacheInvalidatorPort } from '../../../shared/caching/application/ports/cache-invalidator.port';

describe('DeleteProductUseCase', () => {
  let useCase: DeleteProductUseCase;
  let productRepository: jest.Mocked<IProductRepository>;
  let cacheInvalidator: jest.Mocked<CacheInvalidatorPort>;

  beforeEach(() => {
    productRepository = {
      delete: jest.fn(),
    } as any;

    cacheInvalidator = {
      invalidateProduct: jest.fn(),
    } as any;

    useCase = new DeleteProductUseCase(productRepository, cacheInvalidator);
  });

  it('should delete the product and invalidate its cache', async () => {
    productRepository.delete.mockResolvedValue(true);

    await expect(useCase.execute('1')).resolves.toBeUndefined();

    expect(productRepository.delete).toHaveBeenCalledWith('1');
    expect(cacheInvalidator.invalidateProduct).toHaveBeenCalledTimes(1);
    expect(cacheInvalidator.invalidateProduct).toHaveBeenCalledWith('1');
  });

  it('should throw NotFoundException and not invalidate cache when the product is not found', async () => {
    productRepository.delete.mockResolvedValue(false);

    await expect(useCase.execute('1')).rejects.toThrow(
      new NotFoundException('محصول مورد نظر یافت نشد'),
    );

    expect(cacheInvalidator.invalidateProduct).not.toHaveBeenCalled();
  });
});
