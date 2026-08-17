import { AddToWishlistUseCase } from './add-to-wishlist.usecase';
import { IUserRepository } from '../../domain/user.repository.port';
import { IncrementProductFieldUseCase } from '../../../products/application/use-cases/increment-product-field.usecase';
import { NotFoundException } from '@nestjs/common';

describe('AddToWishlistUseCase', () => {
  let usecase: AddToWishlistUseCase;
  let repo: jest.Mocked<IUserRepository>;
  let incrementProductField: jest.Mocked<IncrementProductFieldUseCase>;

  beforeEach(() => {
    repo = {
      addToWishlist: jest.fn(),
    } as any;

    incrementProductField = {
      execute: jest.fn(),
    } as any;

    usecase = new AddToWishlistUseCase(repo, incrementProductField);
  });

  it('should add the product to the wishlist and increment wishlistAdds', async () => {
    const user = { id: 'user-1' };

    repo.addToWishlist.mockResolvedValue(user as any);
    incrementProductField.execute.mockResolvedValue({} as any);

    await expect(
      usecase.execute('user-1', 'product-1'),
    ).resolves.toEqual(user);

    expect(repo.addToWishlist).toHaveBeenCalledWith('user-1', 'product-1');

    expect(incrementProductField.execute).toHaveBeenCalledWith(
      'product-1',
      'wishlistAdds',
    );
  });

  it('should throw NotFoundException when user does not exist', async () => {
    repo.addToWishlist.mockRejectedValue(new Error('USER_NOT_FOUND'));

    await expect(
      usecase.execute('user-1', 'product-1'),
    ).rejects.toThrow(
      new NotFoundException('User not found'),
    );

    expect(incrementProductField.execute).not.toHaveBeenCalled();
  });

  it('should rethrow unexpected errors', async () => {
    repo.addToWishlist.mockRejectedValue(new Error('DB down'));

    await expect(
      usecase.execute('user-1', 'product-1'),
    ).rejects.toThrow('DB down');

    expect(incrementProductField.execute).not.toHaveBeenCalled();
  });
});
