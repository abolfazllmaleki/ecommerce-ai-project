import { DeleteCommentUseCase } from './delete-comment.usecase';
import { ICommentRepository } from '../../domain/comment.repository.port';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('DeleteCommentUseCase', () => {
  let usecase: DeleteCommentUseCase;
  let repository: jest.Mocked<ICommentRepository>;

  beforeEach(() => {
    repository = {
      findById: jest.fn(),
      softDelete: jest.fn(),
    } as any;

    usecase = new DeleteCommentUseCase(repository);
  });

  it('should soft delete the comment', async () => {
    const comment = {
      id: 'comment-1',
      userId: 'user-1',
    };

    const deleted = {
      id: 'comment-1',
      isActive: false,
    };

    repository.findById.mockResolvedValue(comment as any);
    repository.softDelete.mockResolvedValue(deleted as any);

    await expect(
      usecase.execute('comment-1', 'user-1'),
    ).resolves.toEqual(deleted);

    expect(repository.findById).toHaveBeenCalledWith('comment-1');

    expect(repository.softDelete).toHaveBeenCalledWith('comment-1');
  });

  it('should throw NotFoundException when comment does not exist', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(
      usecase.execute('comment-1', 'user-1'),
    ).rejects.toThrow(
      new NotFoundException('Comment not found'),
    );

    expect(repository.softDelete).not.toHaveBeenCalled();
  });

  it('should throw ForbiddenException when deleting another user comment', async () => {
    const comment = {
      id: 'comment-1',
      userId: 'other-user',
    };

    repository.findById.mockResolvedValue(comment as any);

    await expect(
      usecase.execute('comment-1', 'user-1'),
    ).rejects.toThrow(
      new ForbiddenException('You can only delete your own comments'),
    );

    expect(repository.softDelete).not.toHaveBeenCalled();
  });

  it('should throw NotFoundException when soft delete fails', async () => {
    const comment = {
      id: 'comment-1',
      userId: 'user-1',
    };

    repository.findById.mockResolvedValue(comment as any);
    repository.softDelete.mockResolvedValue(null);

    await expect(
      usecase.execute('comment-1', 'user-1'),
    ).rejects.toThrow(
      new NotFoundException('Comment not found'),
    );

    expect(repository.softDelete).toHaveBeenCalledWith('comment-1');
  });
});
