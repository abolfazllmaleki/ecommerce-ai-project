import { GenerateRecommendationsUseCase } from './generate-recommendations.usecase';
import { IUserRepository } from '../../domain/user.repository.port';

describe('GenerateRecommendationsUseCase', () => {
  let usecase: GenerateRecommendationsUseCase;
  let repo: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    repo = {
      generateRecommendations: jest.fn(),
    } as any;

    usecase = new GenerateRecommendationsUseCase(repo);
  });

  it('should return the generated recommendation ids', async () => {
    const recommendations = ['product-1', 'product-2'];

    repo.generateRecommendations.mockResolvedValue(recommendations);

    await expect(
      usecase.execute('user-1', 5),
    ).resolves.toEqual(recommendations);

    expect(repo.generateRecommendations).toHaveBeenCalledWith('user-1', 5);
  });

  it('should return an empty list when there are no recommendations', async () => {
    repo.generateRecommendations.mockResolvedValue([]);

    await expect(
      usecase.execute('user-1', 5),
    ).resolves.toEqual([]);

    expect(repo.generateRecommendations).toHaveBeenCalledWith('user-1', 5);
  });
});
