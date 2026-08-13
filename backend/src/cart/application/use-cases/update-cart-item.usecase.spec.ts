import { UpdateCartItemUseCase } from './update-cart-item.usecase';
import { ICartRepository } from '../../domain/cart.repository.port';
import { NotFoundException } from '@nestjs/common';

describe('UpdateCartItemUseCase', () => {
  let usecase: UpdateCartItemUseCase;
  let repository: jest.Mocked<ICartRepository>;

  beforeEach(() => {
    repository = {
      updateItemQuantity: jest.fn(),
    } as any;

    usecase = new UpdateCartItemUseCase(repository);
  });

  it('should successfully update cart item quantity', async () => {
    const result = {
      userId: 'user-1',
      productId: 'product-1',
      quantity: 3,
    };

    repository.updateItemQuantity.mockResolvedValue(result as any);

    await expect(
      usecase.execute('user-1', 'product-1', 3),
    ).resolves.toEqual(result);

    expect(repository.updateItemQuantity).toHaveBeenCalledWith(
      'user-1',
      'product-1',
      3,
    );
  });

  it('should throw NotFoundException when cart item does not exist', async () => {
    repository.updateItemQuantity.mockRejectedValue(
      new Error('CART_ITEM_NOT_FOUND'),
    );

    await expect(
      usecase.execute('user-1', 'product-1', 3),
    ).rejects.toThrow(
      new NotFoundException('Cart item not found'),
    );
  });

  it('should rethrow unexpected errors', async () => {
    const error = new Error('Database error');

    repository.updateItemQuantity.mockRejectedValue(error);

    await expect(
      usecase.execute('user-1', 'product-1', 3),
    ).rejects.toThrow('Database error');
  });
});