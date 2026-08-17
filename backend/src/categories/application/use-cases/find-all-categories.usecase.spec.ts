import { FindAllCategoriesUseCase } from './find-all-categories.usecase';
import { ICategoryRepository } from '../../domain/category.repository.port';

describe('FindAllCategoriesUseCase', () => {
  let usecase: FindAllCategoriesUseCase;
  let repo: jest.Mocked<ICategoryRepository>;

  beforeEach(() => {
    repo = {
      findAll: jest.fn(),
    } as any;

    usecase = new FindAllCategoriesUseCase(repo);
  });

  it('should return all categories', async () => {
    const categories = [
      { id: 'category-1', name: 'Electronics' },
      { id: 'category-2', name: 'Books' },
    ];

    repo.findAll.mockResolvedValue(categories as any);

    await expect(usecase.execute()).resolves.toEqual(categories);

    expect(repo.findAll).toHaveBeenCalled();
  });
});
