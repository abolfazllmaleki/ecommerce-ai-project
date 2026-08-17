import { FindUserByIdUseCase } from './find-user-by-id.usecase';
import { IUserRepository } from '../../domain/user.repository.port';

describe('FindUserByIdUseCase', () => {
  let usecase: FindUserByIdUseCase;
  let repo: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    repo = {
      findById: jest.fn(),
    } as any;

    usecase = new FindUserByIdUseCase(repo);
  });

  it('should return the user matching the id', async () => {
    const user = { id: 'user-1' };

    repo.findById.mockResolvedValue(user as any);

    await expect(usecase.execute('user-1')).resolves.toEqual(user);

    expect(repo.findById).toHaveBeenCalledWith('user-1', undefined);
  });

  it('should forward the population options to the repository', async () => {
    const user = { id: 'user-1' };
    const options = { populateWishlist: true, populateRecommendations: true };

    repo.findById.mockResolvedValue(user as any);

    await expect(
      usecase.execute('user-1', options),
    ).resolves.toEqual(user);

    expect(repo.findById).toHaveBeenCalledWith('user-1', options);
  });

  it('should return null when no user matches the id', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(usecase.execute('user-1')).resolves.toBeNull();

    expect(repo.findById).toHaveBeenCalledWith('user-1', undefined);
  });
});
