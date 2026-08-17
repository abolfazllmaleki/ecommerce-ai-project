import { DislikeCommentUseCase } from './dislike-comment.usecase';
import { ICommentRepository } from '../../domain/comment.repository.port';
import { NotFoundException } from '@nestjs/common';

describe('DislikeCommentUseCase', () => {
  let usecase: DislikeCommentUseCase;
  let repository: jest.Mocked<ICommentRepository>;

  beforeEach(() => {
    repository = {
      dislikeComment: jest.fn(),
    } as any;

    usecase = new DislikeCommentUseCase(repository);
  });

  it('should dislike the comment', async () => {
    const updated = {
      id: 'comment-1',
      dislikes: 1,
    };

    repository.dislikeComment.mockResolvedValue(updated as any);

    await expect(
      usecase.execute('comment-1', 'user-1'),
    ).resolves.toEqual(updated);

    expect(repository.dislikeComment).toHaveBeenCalledWith(
      'comment-1',
      'user-1',
    );
  });

  it('should throw NotFoundException when comment does not exist', async () => {
    repository.dislikeComment.mockResolvedValue(null);

    await expect(
      usecase.execute('comment-1', 'user-1'),
    ).rejects.toThrow(
      new NotFoundException('Comment not found'),
    );
  });
});
