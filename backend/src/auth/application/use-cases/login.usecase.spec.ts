import { LoginUseCase } from './login.usecase';
import { IUserRepository } from 'src/users/domain/user.repository.port';
import { PasswordHasherPort } from '../../domain/services/password-hasher.port';
import { TokenProviderPort } from '../../domain/services/token-provider.port';
import { UnauthorizedException } from '@nestjs/common';

describe('LoginUseCase', () => {
  let usecase: LoginUseCase;
  let userRepo: jest.Mocked<IUserRepository>;
  let hasher: jest.Mocked<PasswordHasherPort>;
  let tokenProvider: jest.Mocked<TokenProviderPort>;

  beforeEach(() => {
    userRepo = {
      findByEmail: jest.fn(),
    } as any;

    hasher = {
      compare: jest.fn(),
    } as any;

    tokenProvider = {
      sign: jest.fn(),
    } as any;

    usecase = new LoginUseCase(userRepo, hasher, tokenProvider);
  });

  it('should return an access token and user on valid credentials', async () => {
    const user = {
      id: 'user-1',
      email: 'john@example.com',
      role: 'USER',
      password: 'hashed-password',
    };

    userRepo.findByEmail.mockResolvedValue(user as any);
    hasher.compare.mockResolvedValue(true);
    tokenProvider.sign.mockReturnValue('signed-token');

    await expect(
      usecase.execute('john@example.com', 'plain-password'),
    ).resolves.toEqual({
      access_token: 'signed-token',
      user: {
        id: 'user-1',
        email: 'john@example.com',
        role: 'USER',
      },
    });

    expect(userRepo.findByEmail).toHaveBeenCalledWith('john@example.com');

    expect(hasher.compare).toHaveBeenCalledWith(
      'plain-password',
      'hashed-password',
    );

    expect(tokenProvider.sign).toHaveBeenCalledWith({
      sub: 'user-1',
      role: 'USER',
      email: 'john@example.com',
    });
  });

  it('should throw UnauthorizedException when user does not exist', async () => {
    userRepo.findByEmail.mockResolvedValue(null);

    await expect(
      usecase.execute('john@example.com', 'plain-password'),
    ).rejects.toThrow(new UnauthorizedException('Invalid credentials'));

    expect(hasher.compare).not.toHaveBeenCalled();
    expect(tokenProvider.sign).not.toHaveBeenCalled();
  });

  it('should throw UnauthorizedException when password is invalid', async () => {
    const user = {
      id: 'user-1',
      email: 'john@example.com',
      role: 'USER',
      password: 'hashed-password',
    };

    userRepo.findByEmail.mockResolvedValue(user as any);
    hasher.compare.mockResolvedValue(false);

    await expect(
      usecase.execute('john@example.com', 'wrong-password'),
    ).rejects.toThrow(new UnauthorizedException('Invalid credentials'));

    expect(hasher.compare).toHaveBeenCalledWith(
      'wrong-password',
      'hashed-password',
    );

    expect(tokenProvider.sign).not.toHaveBeenCalled();
  });
});
