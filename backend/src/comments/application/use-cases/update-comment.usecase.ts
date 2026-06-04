import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ICommentRepository } from '../../domain/comment.repository.port';
import { Comment } from '../../domain/comment.entity';
import { UpdateCommentDto } from '../../dto/update-comment.dto';

@Injectable()
export class UpdateCommentUseCase {
  constructor(
    @Inject('ICommentRepository') private readonly repo: ICommentRepository,
  ) {}

  async execute(
    id: string,
    dto: UpdateCommentDto,
    userId: string,
  ): Promise<Comment> {
    const comment = await this.repo.findById(id);
    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.userId !== userId) {
      throw new ForbiddenException('You can only update your own comments');
    }

    if (dto.content !== undefined) {
      comment.updateContent(dto.content, dto.isActive);
    } else if (dto.isActive !== undefined) {
      comment.updateContent(comment.content, dto.isActive);
    }

    const updated = await this.repo.update(comment);
    if (!updated) throw new NotFoundException('Comment not found');
    return updated;
  }
}
