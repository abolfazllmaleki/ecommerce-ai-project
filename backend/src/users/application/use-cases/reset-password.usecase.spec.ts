import { ResetPasswordUseCase } from './reset-password.usecase';
import { IUserRepository } from '../../domain/user.repository.port';
import { NotFoundException } from '@nestjs/common';

describe('ResetPasswordUseCase', () => {
  let usecase: ResetPasswordUseCase;
  let repo: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    repo = {
      resetPassword: jest.fn(),
    } as any;

    usecase = new ResetPasswordUseCase(repo);
  });

  it('should reset the password and return true', async () => {
    repo.resetPassword.mockResolvedValue(true);

    await expect(
      usecase.execute('reset-token', 'hashed-password'),
    ).resolves.toBe(true);

    expect(repo.resetPassword).toHaveBeenCalledWith(
      'reset-token',
      'hashed-password',
    );
  });

  it('should throw NotFoundException when the reset token is invalid', async () => {
    repo.resetPassword.mockRejectedValue(new Error('INVALID_RESET_TOKEN'));

    await expect(
      usecase.execute('reset-token', 'hashed-password'),
    ).rejects.toThrow(
      new NotFoundException('Invalid or expired reset token'),
    );
  });

  it('should rethrow unexpected errors', async () => {
    repo.resetPassword.mockRejectedValue(new Error('DB down'));

    await expect(
      usecase.execute('reset-token', 'hashed-password'),
    ).rejects.toThrow('DB down');
  });
});
