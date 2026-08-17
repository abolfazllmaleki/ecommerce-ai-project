import { LikeCommentUseCase } from './like-comment.usecase';
import { ICommentRepository } from '../../domain/comment.repository.port';
import { NotFoundException } from '@nestjs/common';

describe('LikeCommentUseCase', () => {
  let usecase: LikeCommentUseCase;
  let repository: jest.Mocked<ICommentRepository>;

  beforeEach(() => {
    repository = {
      likeComment: jest.fn(),
    } as any;

    usecase = new LikeCommentUseCase(repository);
  });

  it('should like the comment', async () => {
    const updated = {
      id: 'comment-1',
      likes: 1,
    };

    repository.likeComment.mockResolvedValue(updated as any);

    await expect(
      usecase.execute('comment-1', 'user-1'),
    ).resolves.toEqual(updated);

    expect(repository.likeComment).toHaveBeenCalledWith(
      'comment-1',
      'user-1',
    );
  });

  it('should throw NotFoundException when comment does not exist', async () => {
    repository.likeComment.mockResolvedValue(null);

    await expect(
      usecase.execute('comment-1', 'user-1'),
    ).rejects.toThrow(
      new NotFoundException('Comment not found'),
    );
  });
});
