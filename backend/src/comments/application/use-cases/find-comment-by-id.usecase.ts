import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ICommentRepository } from '../../domain/comment.repository.port';
import { Comment } from '../../domain/comment.entity';

@Injectable()
export class FindCommentByIdUseCase {
  constructor(
    @Inject('ICommentRepository') private readonly repo: ICommentRepository,
  ) {}

  async execute(id: string): Promise<Comment> {
    const comment = await this.repo.findById(id);
    if (!comment) throw new NotFoundException('Comment not found');
    return comment;
  }
}
