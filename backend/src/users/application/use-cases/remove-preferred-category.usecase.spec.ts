import { RemovePreferredCategoryUseCase } from './remove-preferred-category.usecase';
import { IUserRepository } from '../../domain/user.repository.port';
import { NotFoundException } from '@nestjs/common';

describe('RemovePreferredCategoryUseCase', () => {
  let usecase: RemovePreferredCategoryUseCase;
  let repo: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    repo = {
      removePreferredCategory: jest.fn(),
    } as any;

    usecase = new RemovePreferredCategoryUseCase(repo);
  });

  it('should remove the preferred category and return the user', async () => {
    const user = { id: 'user-1' };

    repo.removePreferredCategory.mockResolvedValue(user as any);

    await expect(
      usecase.execute('user-1', 'electronics'),
    ).resolves.toEqual(user);

    expect(repo.removePreferredCategory).toHaveBeenCalledWith(
      'user-1',
      'electronics',
    );
  });

  it('should throw NotFoundException when user does not exist', async () => {
    repo.removePreferredCategory.mockRejectedValue(
      new Error('USER_NOT_FOUND'),
    );

    await expect(
      usecase.execute('user-1', 'electronics'),
    ).rejects.toThrow(
      new NotFoundException('User not found'),
    );
  });

  it('should rethrow unexpected errors', async () => {
    repo.removePreferredCategory.mockRejectedValue(new Error('DB down'));

    await expect(
      usecase.execute('user-1', 'electronics'),
    ).rejects.toThrow('DB down');
  });
});
