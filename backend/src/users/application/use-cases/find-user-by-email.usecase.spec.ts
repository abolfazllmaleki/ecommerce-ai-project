import { FindUserByEmailUseCase } from './find-user-by-email.usecase';
import { IUserRepository } from '../../domain/user.repository.port';

describe('FindUserByEmailUseCase', () => {
  let usecase: FindUserByEmailUseCase;
  let repo: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    repo = {
      findByEmail: jest.fn(),
    } as any;

    usecase = new FindUserByEmailUseCase(repo);
  });

  it('should return the user matching the email', async () => {
    const user = { id: 'user-1', email: 'john@example.com' };

    repo.findByEmail.mockResolvedValue(user as any);

    await expect(
      usecase.execute('john@example.com'),
    ).resolves.toEqual(user);

    expect(repo.findByEmail).toHaveBeenCalledWith('john@example.com');
  });

  it('should return null when no user matches the email', async () => {
    repo.findByEmail.mockResolvedValue(null);

    await expect(
      usecase.execute('john@example.com'),
    ).resolves.toBeNull();

    expect(repo.findByEmail).toHaveBeenCalledWith('john@example.com');
  });
});
