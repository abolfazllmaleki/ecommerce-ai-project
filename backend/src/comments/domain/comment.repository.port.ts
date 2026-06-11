import { Comment } from './comment.entity';

export interface CommentPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ProductCommentsResult {
  comments: Record<string, unknown>[];
  pagination: CommentPagination;
}

export interface CommentRepliesResult {
  replies: Record<string, unknown>[];
  pagination: CommentPagination;
}

export interface ICommentRepository {
  create(comment: Comment): Promise<Comment>;
  findById(id: string): Promise<Comment | null>;
  findParentById(id: string): Promise<Comment | null>;
  incrementReplyCount(parentId: string): Promise<void>;
  findAllByProduct(
    productId: string,
    page: number,
    limit: number,
    userId?: string,
  ): Promise<ProductCommentsResult>;
  findReplies(
    commentId: string,
    page: number,
    limit: number,
    userId?: string,
  ): Promise<CommentRepliesResult>;
  update(comment: Comment): Promise<Comment | null>;
  softDelete(id: string): Promise<Comment | null>;
  likeComment(commentId: string, userId: string): Promise<Comment | null>;
  dislikeComment(commentId: string, userId: string): Promise<Comment | null>;
}
