import { CreatePasswordResetTokenUseCase } from './create-password-reset-token.usecase';
import { IUserRepository } from '../../domain/user.repository.port';

describe('CreatePasswordResetTokenUseCase', () => {
  let usecase: CreatePasswordResetTokenUseCase;
  let repo: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    repo = {
      createPasswordResetToken: jest.fn(),
    } as any;

    usecase = new CreatePasswordResetTokenUseCase(repo);
  });

  it('should return the generated reset token', async () => {
    repo.createPasswordResetToken.mockResolvedValue('reset-token-1');

    await expect(
      usecase.execute('user@example.com'),
    ).resolves.toBe('reset-token-1');

    expect(repo.createPasswordResetToken).toHaveBeenCalledWith(
      'user@example.com',
    );
  });

  it('should return null when no token is generated', async () => {
    repo.createPasswordResetToken.mockResolvedValue(null);

    await expect(
      usecase.execute('user@example.com'),
    ).resolves.toBeNull();

    expect(repo.createPasswordResetToken).toHaveBeenCalledWith(
      'user@example.com',
    );
  });
});
