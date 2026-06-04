import { Inject, Injectable } from '@nestjs/common';
import {
  CommentRepliesResult,
  ICommentRepository,
} from '../../domain/comment.repository.port';

@Injectable()
export class FindCommentRepliesUseCase {
  constructor(
    @Inject('ICommentRepository') private readonly repo: ICommentRepository,
  ) {}

  async execute(
    commentId: string,
    page: number,
    limit: number,
    userId?: string,
  ): Promise<CommentRepliesResult> {
    return this.repo.findReplies(commentId, page, limit, userId);
  }
}
