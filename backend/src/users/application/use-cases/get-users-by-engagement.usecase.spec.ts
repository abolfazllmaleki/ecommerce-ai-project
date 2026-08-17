import { GetUsersByEngagementUseCase } from './get-users-by-engagement.usecase';
import { IUserRepository } from '../../domain/user.repository.port';

describe('GetUsersByEngagementUseCase', () => {
  let usecase: GetUsersByEngagementUseCase;
  let repo: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    repo = {
      getUsersByEngagement: jest.fn(),
    } as any;

    usecase = new GetUsersByEngagementUseCase(repo);
  });

  it('should return the users matching the minimum engagement score', async () => {
    const users = [{ id: 'user-1' }, { id: 'user-2' }];

    repo.getUsersByEngagement.mockResolvedValue(users as any);

    await expect(usecase.execute(10)).resolves.toEqual(users);

    expect(repo.getUsersByEngagement).toHaveBeenCalledWith(10);
  });

  it('should return an empty array when no user meets the threshold', async () => {
    repo.getUsersByEngagement.mockResolvedValue([]);

    await expect(usecase.execute(100)).resolves.toEqual([]);

    expect(repo.getUsersByEngagement).toHaveBeenCalledWith(100);
  });
});
