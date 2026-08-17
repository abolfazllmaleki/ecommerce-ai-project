import { UpdateCommentUseCase } from './update-comment.usecase';
import { ICommentRepository } from '../../domain/comment.repository.port';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('UpdateCommentUseCase', () => {
  let usecase: UpdateCommentUseCase;
  let repository: jest.Mocked<ICommentRepository>;

  beforeEach(() => {
    repository = {
      findById: jest.fn(),
      update: jest.fn(),
    } as any;

    usecase = new UpdateCommentUseCase(repository);
  });

  it('should update the comment content', async () => {
    const comment = {
      userId: 'user-1',
      content: 'old content',
      updateContent: jest.fn(),
    };

    const updated = {
      id: 'comment-1',
      content: 'new content',
    };

    repository.findById.mockResolvedValue(comment as any);
    repository.update.mockResolvedValue(updated as any);

    await expect(
      usecase.execute(
        'comment-1',
        { content: 'new content', isActive: true } as any,
        'user-1',
      ),
    ).resolves.toEqual(updated);

    expect(repository.findById).toHaveBeenCalledWith('comment-1');

    expect(comment.updateContent).toHaveBeenCalledWith('new content', true);

    expect(repository.update).toHaveBeenCalledWith(comment);
  });

  it('should update only the active flag when content is not provided', async () => {
    const comment = {
      userId: 'user-1',
      content: 'existing content',
      updateContent: jest.fn(),
    };

    repository.findById.mockResolvedValue(comment as any);
    repository.update.mockResolvedValue(comment as any);

    await usecase.execute('comment-1', { isActive: false } as any, 'user-1');

    expect(comment.updateContent).toHaveBeenCalledWith(
      'existing content',
      false,
    );

    expect(repository.update).toHaveBeenCalledWith(comment);
  });

  it('should throw NotFoundException when comment does not exist', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(
      usecase.execute('comment-1', { content: 'new content' } as any, 'user-1'),
    ).rejects.toThrow(
      new NotFoundException('Comment not found'),
    );

    expect(repository.update).not.toHaveBeenCalled();
  });

  it('should throw ForbiddenException when updating another user comment', async () => {
    const comment = {
      userId: 'other-user',
      content: 'old content',
      updateContent: jest.fn(),
    };

    repository.findById.mockResolvedValue(comment as any);

    await expect(
      usecase.execute('comment-1', { content: 'new content' } as any, 'user-1'),
    ).rejects.toThrow(
      new ForbiddenException('You can only update your own comments'),
    );

    expect(comment.updateContent).not.toHaveBeenCalled();
    expect(repository.update).not.toHaveBeenCalled();
  });

  it('should throw NotFoundException when update fails', async () => {
    const comment = {
      userId: 'user-1',
      content: 'old content',
      updateContent: jest.fn(),
    };

    repository.findById.mockResolvedValue(comment as any);
    repository.update.mockResolvedValue(null);

    await expect(
      usecase.execute('comment-1', { content: 'new content' } as any, 'user-1'),
    ).rejects.toThrow(
      new NotFoundException('Comment not found'),
    );

    expect(comment.updateContent).toHaveBeenCalledWith('new content', undefined);

    expect(repository.update).toHaveBeenCalledWith(comment);
  });
});
