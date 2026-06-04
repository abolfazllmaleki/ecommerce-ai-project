import { Types } from 'mongoose';
import { Comment } from '../domain/comment.entity';
import { CommentDocument } from '../schemas/comment.schema';

export class CommentMapper {
  static toDomain(doc: CommentDocument | any): Comment {
    return Comment.fromPersistence(doc);
  }

  static toPersistence(comment: Comment): Record<string, unknown> {
    return {
      userId: new Types.ObjectId(comment.userId),
      productId: new Types.ObjectId(comment.productId),
      content: comment.content,
      likes: comment.likes,
      dislikes: comment.dislikes,
      isActive: comment.isActive,
      likedBy: comment.likedBy.map(id => new Types.ObjectId(id)),
      dislikedBy: comment.dislikedBy.map(id => new Types.ObjectId(id)),
      parentCommentId: comment.parentCommentId
        ? new Types.ObjectId(comment.parentCommentId)
        : null,
      depth: comment.depth,
      replyCount: comment.replyCount,
      updatedAt: comment.updatedAt,
    };
  }

  static toPersistenceOnCreate(comment: Comment): Record<string, unknown> {
    return {
      ...this.toPersistence(comment),
      createdAt: comment.createdAt,
    };
  }
}
