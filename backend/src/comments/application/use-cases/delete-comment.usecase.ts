import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ICommentRepository } from '../../domain/comment.repository.port';
import { Comment } from '../../domain/comment.entity';

@Injectable()
export class DeleteCommentUseCase {
  constructor(
    @Inject('ICommentRepository') private readonly repo: ICommentRepository,
  ) {}

  async execute(id: string, userId: string): Promise<Comment> {
    const comment = await this.repo.findById(id);
    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.userId !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    const deleted = await this.repo.softDelete(id);
    if (!deleted) throw new NotFoundException('Comment not found');
    return deleted;
  }
}
