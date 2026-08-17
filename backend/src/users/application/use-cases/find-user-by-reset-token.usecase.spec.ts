import { FindUserByResetTokenUseCase } from './find-user-by-reset-token.usecase';
import { IUserRepository } from '../../domain/user.repository.port';

describe('FindUserByResetTokenUseCase', () => {
  let usecase: FindUserByResetTokenUseCase;
  let repo: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    repo = {
      findByResetToken: jest.fn(),
    } as any;

    usecase = new FindUserByResetTokenUseCase(repo);
  });

  it('should return the user matching the reset token', async () => {
    const user = { id: 'user-1' };

    repo.findByResetToken.mockResolvedValue(user as any);

    await expect(
      usecase.execute('reset-token-1'),
    ).resolves.toEqual(user);

    expect(repo.findByResetToken).toHaveBeenCalledWith('reset-token-1');
  });

  it('should return null when no user matches the reset token', async () => {
    repo.findByResetToken.mockResolvedValue(null);

    await expect(
      usecase.execute('reset-token-1'),
    ).resolves.toBeNull();

    expect(repo.findByResetToken).toHaveBeenCalledWith('reset-token-1');
  });
});
