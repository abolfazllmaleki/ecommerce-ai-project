import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ICommentRepository } from '../../domain/comment.repository.port';
import { Comment } from '../../domain/comment.entity';

@Injectable()
export class DislikeCommentUseCase {
  constructor(
    @Inject('ICommentRepository') private readonly repo: ICommentRepository,
  ) {}

  async execute(commentId: string, userId: string): Promise<Comment> {
    const updated = await this.repo.dislikeComment(commentId, userId);
    if (!updated) throw new NotFoundException('Comment not found');
    return updated;
  }
}
