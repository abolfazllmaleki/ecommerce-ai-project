import { RateProductUseCase } from './rate-product.usecase';
import { IUserRepository } from '../../domain/user.repository.port';
import { IProductRepository } from '../../../products/domain/product.repository.port';
import { RateProductDto } from '../../dto/rate-product.dto';
import { NotFoundException } from '@nestjs/common';

describe('RateProductUseCase', () => {
  let usecase: RateProductUseCase;
  let userRepo: jest.Mocked<IUserRepository>;
  let productRepo: jest.Mocked<IProductRepository>;

  const dto: RateProductDto = {
    productId: 'product-1',
    rating: 4,
  };

  beforeEach(() => {
    userRepo = {
      findById: jest.fn(),
      saveUserRatings: jest.fn(),
      getProductRatingAggregate: jest.fn(),
    } as any;

    productRepo = {
      findById: jest.fn(),
      updateRatingStats: jest.fn(),
    } as any;

    usecase = new RateProductUseCase(userRepo, productRepo);
  });

  it('should rate the product, update stats and return the refreshed user', async () => {
    const user = { id: 'user-1', rateProduct: jest.fn() };
    const updated = {
      id: 'user-1',
      ratings: [{ productId: 'product-1', rating: 4 }],
    };
    const product = { id: 'product-1' };
    const aggregate = { averageRating: 4.5, count: 10 };

    userRepo.findById
      .mockResolvedValueOnce(user as any)
      .mockResolvedValueOnce(updated as any);
    productRepo.findById.mockResolvedValue(product as any);
    userRepo.saveUserRatings.mockResolvedValue(user as any);
    userRepo.getProductRatingAggregate.mockResolvedValue(aggregate);
    productRepo.updateRatingStats.mockResolvedValue(product as any);

    await expect(usecase.execute('user-1', dto)).resolves.toEqual(updated);

    expect(userRepo.findById).toHaveBeenCalledWith('user-1');
    expect(userRepo.findById).toHaveBeenCalledTimes(2);

    expect(productRepo.findById).toHaveBeenCalledWith('product-1');

    expect(user.rateProduct).toHaveBeenCalledWith('product-1', 4);

    expect(userRepo.saveUserRatings).toHaveBeenCalledWith(user);

    expect(userRepo.getProductRatingAggregate).toHaveBeenCalledWith('product-1');

    expect(productRepo.updateRatingStats).toHaveBeenCalledWith(
      'product-1',
      4.5,
      10,
    );
  });

  it('should throw NotFoundException when user does not exist', async () => {
    userRepo.findById.mockResolvedValue(null);

    await expect(usecase.execute('user-1', dto)).rejects.toThrow(
      new NotFoundException('User not found'),
    );

    expect(productRepo.findById).not.toHaveBeenCalled();
    expect(userRepo.saveUserRatings).not.toHaveBeenCalled();
  });

  it('should throw NotFoundException when product does not exist', async () => {
    const user = { id: 'user-1', rateProduct: jest.fn() };

    userRepo.findById.mockResolvedValue(user as any);
    productRepo.findById.mockResolvedValue(null);

    await expect(usecase.execute('user-1', dto)).rejects.toThrow(
      new NotFoundException('Product not found'),
    );

    expect(user.rateProduct).not.toHaveBeenCalled();
    expect(userRepo.saveUserRatings).not.toHaveBeenCalled();
    expect(productRepo.updateRatingStats).not.toHaveBeenCalled();
  });
});
