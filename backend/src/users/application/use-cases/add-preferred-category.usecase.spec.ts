import { AddPreferredCategoryUseCase } from './add-preferred-category.usecase';
import { IUserRepository } from '../../domain/user.repository.port';
import { NotFoundException } from '@nestjs/common';

describe('AddPreferredCategoryUseCase', () => {
  let usecase: AddPreferredCategoryUseCase;
  let repo: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    repo = {
      addPreferredCategory: jest.fn(),
    } as any;

    usecase = new AddPreferredCategoryUseCase(repo);
  });

  it('should add the preferred category and return the user', async () => {
    const user = { id: 'user-1' };

    repo.addPreferredCategory.mockResolvedValue(user as any);

    await expect(
      usecase.execute('user-1', 'electronics'),
    ).resolves.toEqual(user);

    expect(repo.addPreferredCategory).toHaveBeenCalledWith(
      'user-1',
      'electronics',
    );
  });

  it('should throw NotFoundException when user does not exist', async () => {
    repo.addPreferredCategory.mockRejectedValue(new Error('USER_NOT_FOUND'));

    await expect(
      usecase.execute('user-1', 'electronics'),
    ).rejects.toThrow(
      new NotFoundException('User not found'),
    );
  });

  it('should rethrow unexpected errors', async () => {
    repo.addPreferredCategory.mockRejectedValue(new Error('DB down'));

    await expect(
      usecase.execute('user-1', 'electronics'),
    ).rejects.toThrow('DB down');
  });
});
