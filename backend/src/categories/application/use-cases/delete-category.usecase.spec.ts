import { DeleteCategoryUseCase } from './delete-category.usecase';
import { ICategoryRepository } from '../../domain/category.repository.port';

describe('DeleteCategoryUseCase', () => {
  let usecase: DeleteCategoryUseCase;
  let repo: jest.Mocked<ICategoryRepository>;

  beforeEach(() => {
    repo = {
      delete: jest.fn(),
    } as any;

    usecase = new DeleteCategoryUseCase(repo);
  });

  it('should delete the category by id', async () => {
    repo.delete.mockResolvedValue(true);

    await expect(usecase.execute('category-1')).resolves.toBeUndefined();

    expect(repo.delete).toHaveBeenCalledWith('category-1');
  });
});
