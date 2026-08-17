import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  CommentRepliesResult,
  ICommentRepository,
  ProductCommentsResult,
} from '../domain/comment.repository.port';
import { Comment as CommentEntity } from '../domain/comment.entity';
import { Comment, CommentDocument } from '../schemas/comment.schema';
import { CommentMapper } from './comment.mapper';

@Injectable()
export class CommentRepository implements ICommentRepository {
  constructor(
    @InjectModel(Comment.name)
    private readonly model: Model<CommentDocument>,
  ) {}

  async create(comment: CommentEntity): Promise<CommentEntity> {
    const data = CommentMapper.toPersistenceOnCreate(comment);
    const created = new this.model(data);
    const saved = await created.save();
    return CommentMapper.toDomain(saved);
  }

  async findById(id: string): Promise<CommentEntity | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const doc = await this.model
      .findById(id)
      .populate('userId', 'name lastname email')
      .exec();
    return doc ? CommentMapper.toDomain(doc) : null;
  }

  async findParentById(id: string): Promise<CommentEntity | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const doc = await this.model.findById(id).exec();
    return doc ? CommentMapper.toDomain(doc) : null;
  }

  async incrementReplyCount(parentId: string): Promise<void> {
    await this.model.findByIdAndUpdate(parentId, { $inc: { replyCount: 1 } });
  }

  async findAllByProduct(
    productId: string,
    page: number,
    limit: number,
    userId?: string,
  ): Promise<ProductCommentsResult> {
    const skip = (page - 1) * limit;

    const comments = await this.model
      .find({
        productId: new Types.ObjectId(productId),
        isActive: true,
        parentCommentId: null,
      })
      .populate('userId', 'name lastname email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const commentsWithReplies = await Promise.all(
      comments.map(async comment => {
        const replies = await this.model
          .find({
            parentCommentId: comment._id,
            isActive: true,
          })
          .populate('userId', 'name lastname email')
          .sort({ createdAt: 1 })
          .limit(3)
          .exec();

        const withReactions = this.addUserReactions([comment, ...replies], userId);

        return {
          ...withReactions[0],
          replies: withReactions.slice(1),
        };
      }),
    );

    const total = await this.model.countDocuments({
      productId: new Types.ObjectId(productId),
      isActive: true,
      parentCommentId: null,
    });

    return {
      comments: commentsWithReplies,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findReplies(
    commentId: string,
    page: number,
    limit: number,
    userId?: string,
  ): Promise<CommentRepliesResult> {
    const skip = (page - 1) * limit;

    const replies = await this.model
      .find({
        parentCommentId: new Types.ObjectId(commentId),
        isActive: true,
      })
      .populate('userId', 'name lastname email')
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const repliesWithReactions = this.addUserReactions(replies, userId);

    const total = await this.model.countDocuments({
      parentCommentId: new Types.ObjectId(commentId),
      isActive: true,
    });

    return {
      replies: repliesWithReactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async update(comment: CommentEntity): Promise<CommentEntity | null> {
    if (!comment.id || !Types.ObjectId.isValid(comment.id)) return null;

    const updated = await this.model
      .findByIdAndUpdate(
        comment.id,
        {
          content: comment.content,
          isActive: comment.isActive,
          updatedAt: comment.updatedAt,
        },
        { new: true, runValidators: true },
      )
      .exec();

    return updated ? CommentMapper.toDomain(updated) : null;
  }

  async softDelete(id: string): Promise<CommentEntity | null> {
    const updated = await this.model
      .findByIdAndUpdate(id, { isActive: false }, { new: true })
      .exec();
    return updated ? CommentMapper.toDomain(updated) : null;
  }

  async likeComment(commentId: string, userId: string): Promise<CommentEntity | null> {
    const comment = await this.model.findById(commentId).exec();
    if (!comment) return null;

    const userObjectId = new Types.ObjectId(userId);

    if (comment.likedBy.some(id => id.equals(userObjectId))) {
      const updated = await this.model
        .findByIdAndUpdate(
          commentId,
          { $pull: { likedBy: userObjectId }, $inc: { likes: -1 } },
          { new: true },
        )
        .exec();
      return updated ? CommentMapper.toDomain(updated) : null;
    }

    let updateData: Record<string, unknown> = {
      $addToSet: { likedBy: userObjectId },
      $inc: { likes: 1 },
    };

    if (comment.dislikedBy.some(id => id.equals(userObjectId))) {
      updateData = {
        ...updateData,
        $pull: { dislikedBy: userObjectId },
        $inc: { ...(updateData.$inc as object), dislikes: -1 },
      };
    }

    const updated = await this.model
      .findByIdAndUpdate(commentId, updateData, { new: true })
      .exec();
    return updated ? CommentMapper.toDomain(updated) : null;
  }

  async dislikeComment(
    commentId: string,
    userId: string,
  ): Promise<CommentEntity | null> {
    const comment = await this.model.findById(commentId).exec();
    if (!comment) return null;

    const userObjectId = new Types.ObjectId(userId);

    if (comment.dislikedBy.some(id => id.equals(userObjectId))) {
      const updated = await this.model
        .findByIdAndUpdate(
          commentId,
          { $pull: { dislikedBy: userObjectId }, $inc: { dislikes: -1 } },
          { new: true },
        )
        .exec();
      return updated ? CommentMapper.toDomain(updated) : null;
    }

    let updateData: Record<string, unknown> = {
      $addToSet: { dislikedBy: userObjectId },
      $inc: { dislikes: 1 },
    };

    if (comment.likedBy.some(id => id.equals(userObjectId))) {
      updateData = {
        ...updateData,
        $pull: { likedBy: userObjectId },
        $inc: { ...(updateData.$inc as object), likes: -1 },
      };
    }

    const updated = await this.model
      .findByIdAndUpdate(commentId, updateData, { new: true })
      .exec();
    return updated ? CommentMapper.toDomain(updated) : null;
  }

  private addUserReactions(
    comments: CommentDocument[],
    userId?: string,
  ): Record<string, unknown>[] {
    const userObjectId = userId ? new Types.ObjectId(userId) : null;

    return comments.map(comment => {
      const { _id, userId: author, ...rest } = comment.toObject();

      const serialized: Record<string, unknown> = {
        ...rest,
        id: _id?.toString(),
        userId: this.serializeAuthor(author),
      };

      if (!userObjectId) return serialized;

      return {
        ...serialized,
        hasLiked: comment.likedBy.some(id => id.equals(userObjectId)),
        hasDisliked: comment.dislikedBy.some(id => id.equals(userObjectId)),
      };
    });
  }

  private serializeAuthor(author: any): unknown {
    if (!author) return author;

    // Unpopulated ref: keep it as a plain id string.
    if (author instanceof Types.ObjectId) return author.toString();

    // Populated author document: expose `id` instead of `_id`.
    if (typeof author === 'object' && author._id) {
      const { _id, ...rest } = author;
      return { ...rest, id: _id.toString() };
    }

    return author;
  }
}
