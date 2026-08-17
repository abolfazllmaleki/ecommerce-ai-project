import { GetWishlistUseCase } from './get-wishlist.usecase';
import { IUserRepository } from '../../domain/user.repository.port';
import { IProductRepository } from '../../../products/domain/product.repository.port';
import { NotFoundException } from '@nestjs/common';

describe('GetWishlistUseCase', () => {
  let usecase: GetWishlistUseCase;
  let userRepo: jest.Mocked<IUserRepository>;
  let productRepo: jest.Mocked<IProductRepository>;

  beforeEach(() => {
    userRepo = {
      getWishlistProductIds: jest.fn(),
    } as any;

    productRepo = {
      findById: jest.fn(),
    } as any;

    usecase = new GetWishlistUseCase(userRepo, productRepo);
  });

  it('should return the plain objects of the wishlist products', async () => {
    const product1 = {
      toPlainObject: jest.fn().mockReturnValue({ id: 'product-1' }),
    };
    const product2 = {
      toPlainObject: jest.fn().mockReturnValue({ id: 'product-2' }),
    };

    userRepo.getWishlistProductIds.mockResolvedValue(['product-1', 'product-2']);
    productRepo.findById
      .mockResolvedValueOnce(product1 as any)
      .mockResolvedValueOnce(product2 as any);

    await expect(usecase.execute('user-1')).resolves.toEqual([
      { id: 'product-1' },
      { id: 'product-2' },
    ]);

    expect(userRepo.getWishlistProductIds).toHaveBeenCalledWith('user-1');
    expect(productRepo.findById).toHaveBeenCalledWith('product-1');
    expect(productRepo.findById).toHaveBeenCalledWith('product-2');
  });

  it('should filter out products that no longer exist', async () => {
    const product1 = {
      toPlainObject: jest.fn().mockReturnValue({ id: 'product-1' }),
    };

    userRepo.getWishlistProductIds.mockResolvedValue(['product-1', 'product-2']);
    productRepo.findById
      .mockResolvedValueOnce(product1 as any)
      .mockResolvedValueOnce(null);

    await expect(usecase.execute('user-1')).resolves.toEqual([
      { id: 'product-1' },
    ]);
  });

  it('should throw NotFoundException when user does not exist', async () => {
    userRepo.getWishlistProductIds.mockRejectedValue(
      new Error('USER_NOT_FOUND'),
    );

    await expect(usecase.execute('user-1')).rejects.toThrow(
      new NotFoundException('User not found'),
    );

    expect(productRepo.findById).not.toHaveBeenCalled();
  });

  it('should rethrow unexpected errors', async () => {
    userRepo.getWishlistProductIds.mockRejectedValue(new Error('DB down'));

    await expect(usecase.execute('user-1')).rejects.toThrow('DB down');
  });
});
