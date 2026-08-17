import { FindCommentByIdUseCase } from './find-comment-by-id.usecase';
import { ICommentRepository } from '../../domain/comment.repository.port';
import { NotFoundException } from '@nestjs/common';

describe('FindCommentByIdUseCase', () => {
  let usecase: FindCommentByIdUseCase;
  let repository: jest.Mocked<ICommentRepository>;

  beforeEach(() => {
    repository = {
      findById: jest.fn(),
    } as any;

    usecase = new FindCommentByIdUseCase(repository);
  });

  it('should return the comment', async () => {
    const comment = {
      id: 'comment-1',
      content: 'Hello',
    };

    repository.findById.mockResolvedValue(comment as any);

    await expect(
      usecase.execute('comment-1'),
    ).resolves.toEqual(comment);

    expect(repository.findById).toHaveBeenCalledWith('comment-1');
  });

  it('should throw NotFoundException when comment does not exist', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(
      usecase.execute('comment-1'),
    ).rejects.toThrow(
      new NotFoundException('Comment not found'),
    );
  });
});
