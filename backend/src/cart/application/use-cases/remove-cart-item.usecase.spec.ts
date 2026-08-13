import { RemoveCartItemUseCase } from './remove-cart-item.usecase';
import { ICartRepository } from '../../domain/cart.repository.port';
import { NotFoundException } from '@nestjs/common';

describe('RemoveCartItemUseCase', () => {
  let usecase: RemoveCartItemUseCase;
  let repository: jest.Mocked<ICartRepository>;

  beforeEach(() => {
    repository = {
      removeItem: jest.fn(),
    } as any;

    usecase = new RemoveCartItemUseCase(repository);
  });

  it('should successfully remove cart item', async () => {
    const result = {
      userId: 'user-1',
      productId: 'product-1',
    };

    repository.removeItem.mockResolvedValue(result as any);

    await expect(
      usecase.execute('user-1', 'product-1'),
    ).resolves.toEqual(result);

    expect(repository.removeItem).toHaveBeenCalledWith(
      'user-1',
      'product-1',
    );
  });

  it('should throw NotFoundException when cart does not exist', async () => {
    repository.removeItem.mockRejectedValue(
      new Error('CART_NOT_FOUND'),
    );

    await expect(
      usecase.execute('user-1', 'product-1'),
    ).rejects.toThrow(
      new NotFoundException('Cart not found'),
    );
  });
});