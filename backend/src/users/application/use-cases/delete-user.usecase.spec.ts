import { DeleteUserUseCase } from './delete-user.usecase';
import { IUserRepository } from '../../domain/user.repository.port';
import { NotFoundException } from '@nestjs/common';

describe('DeleteUserUseCase', () => {
  let usecase: DeleteUserUseCase;
  let repo: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    repo = {
      delete: jest.fn(),
    } as any;

    usecase = new DeleteUserUseCase(repo);
  });

  it('should delete the user when it exists', async () => {
    repo.delete.mockResolvedValue(true);

    await expect(usecase.execute('user-1')).resolves.toBeUndefined();

    expect(repo.delete).toHaveBeenCalledWith('user-1');
  });

  it('should throw NotFoundException when the user does not exist', async () => {
    repo.delete.mockResolvedValue(false);

    await expect(usecase.execute('user-1')).rejects.toThrow(
      new NotFoundException('User not found'),
    );

    expect(repo.delete).toHaveBeenCalledWith('user-1');
  });
});
