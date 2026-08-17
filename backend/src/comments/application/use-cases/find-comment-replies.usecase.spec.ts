import { FindCommentRepliesUseCase } from './find-comment-replies.usecase';
import { ICommentRepository } from '../../domain/comment.repository.port';

describe('FindCommentRepliesUseCase', () => {
  let usecase: FindCommentRepliesUseCase;
  let repository: jest.Mocked<ICommentRepository>;

  beforeEach(() => {
    repository = {
      findReplies: jest.fn(),
    } as any;

    usecase = new FindCommentRepliesUseCase(repository);
  });

  it('should return the replies for a comment', async () => {
    const result = {
      replies: [{ id: 'reply-1' }],
      pagination: { page: 1, limit: 10, total: 1, pages: 1 },
    };

    repository.findReplies.mockResolvedValue(result as any);

    await expect(
      usecase.execute('comment-1', 1, 10, 'user-1'),
    ).resolves.toEqual(result);

    expect(repository.findReplies).toHaveBeenCalledWith(
      'comment-1',
      1,
      10,
      'user-1',
    );
  });

  it('should pass an undefined userId when none is provided', async () => {
    const result = {
      replies: [],
      pagination: { page: 1, limit: 10, total: 0, pages: 0 },
    };

    repository.findReplies.mockResolvedValue(result as any);

    await expect(
      usecase.execute('comment-1', 1, 10),
    ).resolves.toEqual(result);

    expect(repository.findReplies).toHaveBeenCalledWith(
      'comment-1',
      1,
      10,
      undefined,
    );
  });
});
