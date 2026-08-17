import { ValidateResetTokenUseCase } from './validate-reset-token.usecase';
import { IUserRepository } from 'src/users/domain/user.repository.port';

describe('ValidateResetTokenUseCase', () => {
  let usecase: ValidateResetTokenUseCase;
  let userRepo: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    userRepo = {
      findByResetToken: jest.fn(),
    } as any;

    usecase = new ValidateResetTokenUseCase(userRepo);
  });

  it('should return the user when the token is valid', async () => {
    const user = {
      id: 'user-1',
      email: 'john@example.com',
    };

    userRepo.findByResetToken.mockResolvedValue(user as any);

    await expect(usecase.execute('reset-token')).resolves.toEqual(user);

    expect(userRepo.findByResetToken).toHaveBeenCalledWith('reset-token');
  });

  it('should return null when no user matches the token', async () => {
    userRepo.findByResetToken.mockResolvedValue(null);

    await expect(usecase.execute('reset-token')).resolves.toBeNull();

    expect(userRepo.findByResetToken).toHaveBeenCalledWith('reset-token');
  });
});
