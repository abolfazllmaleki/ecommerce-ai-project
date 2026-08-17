import { CreateCategoryUseCase } from './create-category.usecase';
import { ICategoryRepository } from '../../domain/category.repository.port';

describe('CreateCategoryUseCase', () => {
  let usecase: CreateCategoryUseCase;
  let repo: jest.Mocked<ICategoryRepository>;

  beforeEach(() => {
    repo = {
      create: jest.fn(),
    } as any;

    usecase = new CreateCategoryUseCase(repo);
  });

  it('should create a category from the dto', async () => {
    const dto = {
      name: 'Electronics',
      description: 'Electronic devices',
      image: 'electronics.png',
      parentCategory: 'parent-1',
      isActive: true,
    };

    const savedCategory = {
      id: 'category-1',
      name: 'Electronics',
    };

    repo.create.mockResolvedValue(savedCategory as any);

    await expect(usecase.execute(dto as any)).resolves.toEqual(savedCategory);

    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Electronics',
        description: 'Electronic devices',
        image: 'electronics.png',
        parentCategory: 'parent-1',
        isActive: true,
      }),
    );
  });

  it('should default parentCategory to null when not provided', async () => {
    const dto = {
      name: 'Books',
      isActive: true,
    };

    repo.create.mockResolvedValue({ id: 'category-2' } as any);

    await usecase.execute(dto as any);

    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Books',
        parentCategory: null,
      }),
    );
  });
});
