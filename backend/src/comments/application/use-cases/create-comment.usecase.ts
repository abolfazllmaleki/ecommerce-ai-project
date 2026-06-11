import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ICommentRepository } from '../../domain/comment.repository.port';
import { Comment } from '../../domain/comment.entity';
import { CreateCommentDto } from '../../dto/create-comment.dto';
import { IProductRepository } from '../../../products/domain/product.repository.port';

@Injectable()
export class CreateCommentUseCase {
  constructor(
    @Inject('ICommentRepository') private readonly commentRepo: ICommentRepository,
    @Inject('IProductRepository') private readonly productRepo: IProductRepository,
  ) {}

  async execute(dto: CreateCommentDto, userId: string): Promise<Comment> {
    const product = await this.productRepo.findById(dto.productId);
    if (!product) throw new NotFoundException('Product not found');

    let depth = 0;
    if (dto.parentCommentId) {
      const parent = await this.commentRepo.findParentById(dto.parentCommentId);
      if (!parent) throw new NotFoundException('Parent comment not found');
      depth = parent.depth + 1;
      if (depth > 3) {
        throw new ForbiddenException('Maximum comment depth exceeded');
      }
    }

    const comment = new Comment({
      userId,
      productId: dto.productId,
      content: dto.content,
      parentCommentId: dto.parentCommentId ?? null,
      depth,
    });

    const saved = await this.commentRepo.create(comment);

    if (dto.parentCommentId) {
      await this.commentRepo.incrementReplyCount(dto.parentCommentId);
    }

    return saved;
  }
}
