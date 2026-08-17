import { ResetPasswordUseCase } from './reset-password.usecase';
import { IUserRepository } from 'src/users/domain/user.repository.port';
import { PasswordHasherPort } from '../../domain/services/password-hasher.port';
import { BadRequestException } from '@nestjs/common';

describe('ResetPasswordUseCase', () => {
  let usecase: ResetPasswordUseCase;
  let userRepo: jest.Mocked<IUserRepository>;
  let hasher: jest.Mocked<PasswordHasherPort>;

  beforeEach(() => {
    userRepo = {
      findByResetToken: jest.fn(),
      update: jest.fn(),
    } as any;

    hasher = {
      hash: jest.fn(),
    } as any;

    usecase = new ResetPasswordUseCase(userRepo, hasher);
  });

  it('should reset the password when the token is valid and not expired', async () => {
    const user = {
      resetPasswordExpires: new Date(Date.now() + 60 * 60 * 1000),
      setPassword: jest.fn(),
      clearPasswordReset: jest.fn(),
    };

    userRepo.findByResetToken.mockResolvedValue(user as any);
    hasher.hash.mockResolvedValue('hashed-password');
    userRepo.update.mockResolvedValue(user as any);

    await usecase.execute('reset-token', 'new-password');

    expect(userRepo.findByResetToken).toHaveBeenCalledWith('reset-token');

    expect(hasher.hash).toHaveBeenCalledWith('new-password');

    expect(user.setPassword).toHaveBeenCalledWith('hashed-password');

    expect(user.clearPasswordReset).toHaveBeenCalled();

    expect(userRepo.update).toHaveBeenCalledWith(user);
  });

  it('should throw BadRequestException when the token is invalid', async () => {
    userRepo.findByResetToken.mockResolvedValue(null);

    await expect(
      usecase.execute('reset-token', 'new-password'),
    ).rejects.toThrow(new BadRequestException('Invalid token'));

    expect(hasher.hash).not.toHaveBeenCalled();
    expect(userRepo.update).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when the token has expired', async () => {
    const user = {
      resetPasswordExpires: new Date(Date.now() - 60 * 60 * 1000),
      setPassword: jest.fn(),
      clearPasswordReset: jest.fn(),
    };

    userRepo.findByResetToken.mockResolvedValue(user as any);

    await expect(
      usecase.execute('reset-token', 'new-password'),
    ).rejects.toThrow(new BadRequestException('Token expired'));

    expect(hasher.hash).not.toHaveBeenCalled();
    expect(user.setPassword).not.toHaveBeenCalled();
    expect(userRepo.update).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when there is no expiry date', async () => {
    const user = {
      resetPasswordExpires: undefined,
      setPassword: jest.fn(),
      clearPasswordReset: jest.fn(),
    };

    userRepo.findByResetToken.mockResolvedValue(user as any);

    await expect(
      usecase.execute('reset-token', 'new-password'),
    ).rejects.toThrow(new BadRequestException('Token expired'));

    expect(hasher.hash).not.toHaveBeenCalled();
    expect(userRepo.update).not.toHaveBeenCalled();
  });
});
