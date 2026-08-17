import { CreateCommentUseCase } from './create-comment.usecase';
import { ICommentRepository } from '../../domain/comment.repository.port';
import { IProductRepository } from '../../../products/domain/product.repository.port';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('CreateCommentUseCase', () => {
  let usecase: CreateCommentUseCase;
  let commentRepo: jest.Mocked<ICommentRepository>;
  let productRepo: jest.Mocked<IProductRepository>;

  beforeEach(() => {
    commentRepo = {
      create: jest.fn(),
      findParentById: jest.fn(),
      incrementReplyCount: jest.fn(),
    } as any;

    productRepo = {
      findById: jest.fn(),
    } as any;

    usecase = new CreateCommentUseCase(
      commentRepo,
      productRepo,
    );
  });

  it('should create a top-level comment', async () => {
    const dto = {
      productId: 'product-1',
      content: 'Great product!',
    };

    const saved = {
      id: 'comment-1',
      userId: 'user-1',
      productId: 'product-1',
      content: 'Great product!',
    };

    productRepo.findById.mockResolvedValue({ id: 'product-1' } as any);
    commentRepo.create.mockResolvedValue(saved as any);

    await expect(
      usecase.execute(dto as any, 'user-1'),
    ).resolves.toEqual(saved);

    expect(productRepo.findById).toHaveBeenCalledWith('product-1');

    expect(commentRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-1',
        productId: 'product-1',
        content: 'Great product!',
        parentCommentId: null,
        depth: 0,
      }),
    );

    expect(commentRepo.findParentById).not.toHaveBeenCalled();
    expect(commentRepo.incrementReplyCount).not.toHaveBeenCalled();
  });

  it('should create a reply and increment the parent reply count', async () => {
    const dto = {
      productId: 'product-1',
      content: 'A reply',
      parentCommentId: 'parent-1',
    };

    const saved = {
      id: 'comment-2',
      parentCommentId: 'parent-1',
    };

    productRepo.findById.mockResolvedValue({ id: 'product-1' } as any);
    commentRepo.findParentById.mockResolvedValue({ depth: 0 } as any);
    commentRepo.create.mockResolvedValue(saved as any);
    commentRepo.incrementReplyCount.mockResolvedValue(undefined);

    await expect(
      usecase.execute(dto as any, 'user-1'),
    ).resolves.toEqual(saved);

    expect(commentRepo.findParentById).toHaveBeenCalledWith('parent-1');

    expect(commentRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        parentCommentId: 'parent-1',
        depth: 1,
      }),
    );

    expect(commentRepo.incrementReplyCount).toHaveBeenCalledWith('parent-1');
  });

  it('should throw NotFoundException when product does not exist', async () => {
    productRepo.findById.mockResolvedValue(null);

    await expect(
      usecase.execute(
        { productId: 'product-1', content: 'Great product!' } as any,
        'user-1',
      ),
    ).rejects.toThrow(
      new NotFoundException('Product not found'),
    );

    expect(commentRepo.create).not.toHaveBeenCalled();
  });

  it('should throw NotFoundException when parent comment does not exist', async () => {
    productRepo.findById.mockResolvedValue({ id: 'product-1' } as any);
    commentRepo.findParentById.mockResolvedValue(null);

    await expect(
      usecase.execute(
        {
          productId: 'product-1',
          content: 'A reply',
          parentCommentId: 'parent-1',
        } as any,
        'user-1',
      ),
    ).rejects.toThrow(
      new NotFoundException('Parent comment not found'),
    );

    expect(commentRepo.create).not.toHaveBeenCalled();
  });

  it('should throw ForbiddenException when maximum depth is exceeded', async () => {
    productRepo.findById.mockResolvedValue({ id: 'product-1' } as any);
    commentRepo.findParentById.mockResolvedValue({ depth: 3 } as any);

    await expect(
      usecase.execute(
        {
          productId: 'product-1',
          content: 'A reply',
          parentCommentId: 'parent-1',
        } as any,
        'user-1',
      ),
    ).rejects.toThrow(
      new ForbiddenException('Maximum comment depth exceeded'),
    );

    expect(commentRepo.create).not.toHaveBeenCalled();
  });
});
