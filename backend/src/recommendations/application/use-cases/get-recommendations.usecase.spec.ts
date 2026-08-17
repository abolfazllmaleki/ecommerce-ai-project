import { GetRecommendationsUseCase } from './get-recommendations.usecase';
import { GenerateRecommendationsUseCase } from '../../../users/application/use-cases/generate-recommendations.usecase';

describe('GetRecommendationsUseCase', () => {
  let usecase: GetRecommendationsUseCase;
  let generateRecommendations: jest.Mocked<GenerateRecommendationsUseCase>;

  beforeEach(() => {
    generateRecommendations = {
      execute: jest.fn(),
    } as any;

    usecase = new GetRecommendationsUseCase(generateRecommendations);
  });

  it('should return the generated recommendations with the provided limit', async () => {
    const recommendations = ['product-1', 'product-2'];

    generateRecommendations.execute.mockResolvedValue(recommendations);

    await expect(
      usecase.execute('user-1', 10),
    ).resolves.toEqual(recommendations);

    expect(generateRecommendations.execute).toHaveBeenCalledWith('user-1', 10);
  });

  it('should default the limit to 5 when it is not provided', async () => {
    generateRecommendations.execute.mockResolvedValue([]);

    await expect(
      usecase.execute('user-1'),
    ).resolves.toEqual([]);

    expect(generateRecommendations.execute).toHaveBeenCalledWith('user-1', 5);
  });
});
