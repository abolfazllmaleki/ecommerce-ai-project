import { FindAllUsersPaginatedUseCase } from './find-all-users-paginated.usecase';
import {
  IUserRepository,
  PaginatedUsers,
} from '../../domain/user.repository.port';

describe('FindAllUsersPaginatedUseCase', () => {
  let usecase: FindAllUsersPaginatedUseCase;
  let repo: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    repo = {
      findAllPaginated: jest.fn(),
    } as any;

    usecase = new FindAllUsersPaginatedUseCase(repo);
  });

  it('should return the paginated users', async () => {
    const result: PaginatedUsers = {
      items: [{ id: 'user-1' } as any],
      total: 1,
      page: 1,
      limit: 10,
    };

    repo.findAllPaginated.mockResolvedValue(result);

    await expect(usecase.execute(1, 10)).resolves.toEqual(result);

    expect(repo.findAllPaginated).toHaveBeenCalledWith(1, 10);
  });
});
