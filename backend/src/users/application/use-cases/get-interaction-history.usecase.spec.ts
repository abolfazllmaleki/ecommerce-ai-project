import { GetInteractionHistoryUseCase } from './get-interaction-history.usecase';
import { IUserRepository } from '../../domain/user.repository.port';

describe('GetInteractionHistoryUseCase', () => {
  let usecase: GetInteractionHistoryUseCase;
  let repo: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    repo = {
      getInteractionHistory: jest.fn(),
    } as any;

    usecase = new GetInteractionHistoryUseCase(repo);
  });

  it('should return the interaction history for the user', async () => {
    const history = [
      { productId: 'product-1', interactionType: 'view' },
      { productId: 'product-2', interactionType: 'purchase' },
    ];

    repo.getInteractionHistory.mockResolvedValue(history);

    await expect(usecase.execute('user-1')).resolves.toEqual(history);

    expect(repo.getInteractionHistory).toHaveBeenCalledWith('user-1');
  });

  it('should return an empty array when there is no history', async () => {
    repo.getInteractionHistory.mockResolvedValue([]);

    await expect(usecase.execute('user-1')).resolves.toEqual([]);

    expect(repo.getInteractionHistory).toHaveBeenCalledWith('user-1');
  });
});
