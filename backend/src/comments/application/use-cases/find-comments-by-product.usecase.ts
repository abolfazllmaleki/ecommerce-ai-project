import { Inject, Injectable } from '@nestjs/common';
import {
  ICommentRepository,
  ProductCommentsResult,
} from '../../domain/comment.repository.port';

@Injectable()
export class FindCommentsByProductUseCase {
  constructor(
    @Inject('ICommentRepository') private readonly repo: ICommentRepository,
  ) {}

  async execute(
    productId: string,
    page: number,
    limit: number,
    userId?: string,
  ): Promise<ProductCommentsResult> {
    return this.repo.findAllByProduct(productId, page, limit, userId);
  }
}
