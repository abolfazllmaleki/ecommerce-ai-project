import { UpdatePasswordUseCase } from './update-password.usecase';
import { IUserRepository } from '../../domain/user.repository.port';
import { NotFoundException } from '@nestjs/common';

describe('UpdatePasswordUseCase', () => {
  let usecase: UpdatePasswordUseCase;
  let repo: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    repo = {
      updatePassword: jest.fn(),
    } as any;

    usecase = new UpdatePasswordUseCase(repo);
  });

  it('should update the password and return the user', async () => {
    const user = { id: 'user-1' };

    repo.updatePassword.mockResolvedValue(user as any);

    await expect(
      usecase.execute('user-1', 'hashed-password'),
    ).resolves.toEqual(user);

    expect(repo.updatePassword).toHaveBeenCalledWith(
      'user-1',
      'hashed-password',
    );
  });

  it('should throw NotFoundException when user does not exist', async () => {
    repo.updatePassword.mockRejectedValue(new Error('USER_NOT_FOUND'));

    await expect(
      usecase.execute('user-1', 'hashed-password'),
    ).rejects.toThrow(
      new NotFoundException('User not found'),
    );
  });

  it('should rethrow unexpected errors', async () => {
    repo.updatePassword.mockRejectedValue(new Error('DB down'));

    await expect(
      usecase.execute('user-1', 'hashed-password'),
    ).rejects.toThrow('DB down');
  });
});
