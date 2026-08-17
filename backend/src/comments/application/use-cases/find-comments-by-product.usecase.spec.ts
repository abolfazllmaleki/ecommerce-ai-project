import { FindCommentsByProductUseCase } from './find-comments-by-product.usecase';
import { ICommentRepository } from '../../domain/comment.repository.port';

describe('FindCommentsByProductUseCase', () => {
  let usecase: FindCommentsByProductUseCase;
  let repository: jest.Mocked<ICommentRepository>;

  beforeEach(() => {
    repository = {
      findAllByProduct: jest.fn(),
    } as any;

    usecase = new FindCommentsByProductUseCase(repository);
  });

  it('should return the comments for a product', async () => {
    const result = {
      comments: [{ id: 'comment-1' }],
      pagination: { page: 1, limit: 10, total: 1, pages: 1 },
    };

    repository.findAllByProduct.mockResolvedValue(result as any);

    await expect(
      usecase.execute('product-1', 1, 10, 'user-1'),
    ).resolves.toEqual(result);

    expect(repository.findAllByProduct).toHaveBeenCalledWith(
      'product-1',
      1,
      10,
      'user-1',
    );
  });

  it('should pass an undefined userId when none is provided', async () => {
    const result = {
      comments: [],
      pagination: { page: 1, limit: 10, total: 0, pages: 0 },
    };

    repository.findAllByProduct.mockResolvedValue(result as any);

    await expect(
      usecase.execute('product-1', 1, 10),
    ).resolves.toEqual(result);

    expect(repository.findAllByProduct).toHaveBeenCalledWith(
      'product-1',
      1,
      10,
      undefined,
    );
  });
});
