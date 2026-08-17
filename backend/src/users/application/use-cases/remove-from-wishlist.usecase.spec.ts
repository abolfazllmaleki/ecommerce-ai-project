import { RemoveFromWishlistUseCase } from './remove-from-wishlist.usecase';
import { IUserRepository } from '../../domain/user.repository.port';
import { NotFoundException } from '@nestjs/common';

describe('RemoveFromWishlistUseCase', () => {
  let usecase: RemoveFromWishlistUseCase;
  let repo: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    repo = {
      removeFromWishlist: jest.fn(),
    } as any;

    usecase = new RemoveFromWishlistUseCase(repo);
  });

  it('should remove the product from the wishlist and return the user', async () => {
    const user = { id: 'user-1' };

    repo.removeFromWishlist.mockResolvedValue(user as any);

    await expect(
      usecase.execute('user-1', 'product-1'),
    ).resolves.toEqual(user);

    expect(repo.removeFromWishlist).toHaveBeenCalledWith('user-1', 'product-1');
  });

  it('should throw NotFoundException when user does not exist', async () => {
    repo.removeFromWishlist.mockRejectedValue(new Error('USER_NOT_FOUND'));

    await expect(
      usecase.execute('user-1', 'product-1'),
    ).rejects.toThrow(
      new NotFoundException('User not found'),
    );
  });

  it('should rethrow unexpected errors', async () => {
    repo.removeFromWishlist.mockRejectedValue(new Error('DB down'));

    await expect(
      usecase.execute('user-1', 'product-1'),
    ).rejects.toThrow('DB down');
  });
});
