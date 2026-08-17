import { FindCategoryByIdUseCase } from './find-category-by-id.usecase';
import { ICategoryRepository } from '../../domain/category.repository.port';

describe('FindCategoryByIdUseCase', () => {
  let usecase: FindCategoryByIdUseCase;
  let repo: jest.Mocked<ICategoryRepository>;

  beforeEach(() => {
    repo = {
      findById: jest.fn(),
    } as any;

    usecase = new FindCategoryByIdUseCase(repo);
  });

  it('should return the category when found', async () => {
    const category = { id: 'category-1', name: 'Electronics' };

    repo.findById.mockResolvedValue(category as any);

    await expect(usecase.execute('category-1')).resolves.toEqual(category);

    expect(repo.findById).toHaveBeenCalledWith('category-1');
  });

  it('should return null when the category does not exist', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(usecase.execute('category-1')).resolves.toBeNull();

    expect(repo.findById).toHaveBeenCalledWith('category-1');
  });
});
