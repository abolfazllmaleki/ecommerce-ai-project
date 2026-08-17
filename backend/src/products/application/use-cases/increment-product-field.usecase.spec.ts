import { BadRequestException, NotFoundException } from '@nestjs/common';
import { IncrementProductFieldUseCase } from './increment-product-field.usecase';
import { IProductRepository } from '../../domain/product.repository.port';

describe('IncrementProductFieldUseCase', () => {
  let useCase: IncrementProductFieldUseCase;
  let productRepository: jest.Mocked<IProductRepository>;

  beforeEach(() => {
    productRepository = {
      incrementField: jest.fn(),
    } as any;

    useCase = new IncrementProductFieldUseCase(productRepository);
  });

  it('should increment an allowed field and return the updated product', async () => {
    const updated = {
      id: '1',
      views: 6,
    };

    productRepository.incrementField.mockResolvedValue(updated as any);

    await expect(useCase.execute('1', 'views')).resolves.toEqual(updated);

    expect(productRepository.incrementField).toHaveBeenCalledTimes(1);
    expect(productRepository.incrementField).toHaveBeenCalledWith('1', 'views');
  });

  it('should throw BadRequestException for a disallowed field and not touch the repository', async () => {
    await expect(useCase.execute('1', 'price' as any)).rejects.toThrow(
      new BadRequestException('امکان افزایش این فیلد وجود ندارد'),
    );

    expect(productRepository.incrementField).not.toHaveBeenCalled();
  });

  it('should throw NotFoundException when the product does not exist', async () => {
    productRepository.incrementField.mockResolvedValue(null);

    await expect(useCase.execute('missing', 'purchases')).rejects.toThrow(
      new NotFoundException('محصول یافت نشد'),
    );

    expect(productRepository.incrementField).toHaveBeenCalledWith(
      'missing',
      'purchases',
    );
  });
});
