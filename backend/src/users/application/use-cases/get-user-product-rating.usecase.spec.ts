import { GetUserProductRatingUseCase } from './get-user-product-rating.usecase';
import { IUserRepository } from '../../domain/user.repository.port';
import { NotFoundException } from '@nestjs/common';

describe('GetUserProductRatingUseCase', () => {
  let usecase: GetUserProductRatingUseCase;
  let repo: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    repo = {
      getUserProductRating: jest.fn(),
    } as any;

    usecase = new GetUserProductRatingUseCase(repo);
  });

  it('should return the user product rating result', async () => {
    const result = { rating: 4, hasRated: true };

    repo.getUserProductRating.mockResolvedValue(result);

    await expect(
      usecase.execute('user-1', 'product-1'),
    ).resolves.toEqual(result);

    expect(repo.getUserProductRating).toHaveBeenCalledWith(
      'user-1',
      'product-1',
    );
  });

  it('should throw NotFoundException when user does not exist', async () => {
    repo.getUserProductRating.mockRejectedValue(new Error('USER_NOT_FOUND'));

    await expect(
      usecase.execute('user-1', 'product-1'),
    ).rejects.toThrow(
      new NotFoundException('User not found'),
    );
  });

  it('should rethrow unexpected errors', async () => {
    repo.getUserProductRating.mockRejectedValue(new Error('DB down'));

    await expect(
      usecase.execute('user-1', 'product-1'),
    ).rejects.toThrow('DB down');
  });
});
