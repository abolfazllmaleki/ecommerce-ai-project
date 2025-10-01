// src/comments/comments.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment } from './schemas/comment.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from '../users/schemas/user.schema';
import { Product } from '../products/schemas/product.schema';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async create(createCommentDto: CreateCommentDto, userId: string): Promise<Comment> {
    const product = await this.productModel.findById(createCommentDto.productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    let depth = 0;
    let parentComment: Comment | null = null;

    if (createCommentDto.parentCommentId) {
      parentComment = await this.commentModel.findById(createCommentDto.parentCommentId);
      if (!parentComment) {
        throw new NotFoundException('Parent comment not found');
      }
      depth = parentComment.depth + 1;
      
      // Limit nesting depth
      if (depth > 3) {
        throw new ForbiddenException('Maximum comment depth exceeded');
      }
    }

    // const comment = new this.commentModel({
    //   ...createCommentDto,
    //   userId: new Types.ObjectId(userId),
    //   depth,
    // });
    const comment = new this.commentModel({
  productId: new Types.ObjectId(createCommentDto.productId), 
  content: createCommentDto.content,
  parentCommentId: createCommentDto.parentCommentId ? new Types.ObjectId(createCommentDto.parentCommentId) : null,
  userId: new Types.ObjectId(userId),
  depth,
});

    const savedComment = await comment.save();

    // Update parent comment's reply count if this is a reply
    if (parentComment) {
      await this.commentModel.findByIdAndUpdate(
        parentComment._id,
        { $inc: { replyCount: 1 } }
      );
    }

    return savedComment;
  }

  async findAllByProduct(productId: string, page: number = 1, limit: number = 10, userId?: string) {
    const skip = (page - 1) * limit;

    const comments = await this.commentModel
      .find({ 
        productId: new Types.ObjectId(productId), 
        isActive: true,
        parentCommentId: null 
      })
      .populate('userId', 'name lastname email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

      
      console.log(productId)
      console.log(comments)

    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await this.commentModel
          .find({ 
            parentCommentId: comment._id, 
            isActive: true 
          })
          .populate('userId', 'name lastname email')
          .sort({ createdAt: 1 })
          .limit(3)
          .exec();

        const commentWithUserReaction = this.addUserReactions([comment, ...replies], userId);
        
        return {
          ...commentWithUserReaction[0].toObject(),
          replies: commentWithUserReaction.slice(1)
        };
      })
    );

    const total = await this.commentModel.countDocuments({ 
      productId: new Types.ObjectId(productId), 
      isActive: true,
      parentCommentId: null 
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

  async findReplies(commentId: string, page: number = 1, limit: number = 10, userId?: string) {
    const skip = (page - 1) * limit;

    const replies = await this.commentModel
      .find({ 
        parentCommentId: new Types.ObjectId(commentId), 
        isActive: true 
      })
      .populate('userId', 'name lastname email')
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const repliesWithReactions = this.addUserReactions(replies, userId);

    const total = await this.commentModel.countDocuments({ 
      parentCommentId: new Types.ObjectId(commentId), 
      isActive: true 
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

  async findOne(id: string): Promise<Comment> {
    const comment = await this.commentModel
      .findById(id)
      .populate('userId', 'name lastname email')
      .exec();

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }

  async update(id: string, updateCommentDto: UpdateCommentDto, userId: string): Promise<Comment|null> {
    const comment = await this.commentModel.findById(id);

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.userId.toString() !== userId) {
      throw new ForbiddenException('You can only update your own comments');
    }

    // Only allow updating content and isActive
    const { content, isActive } = updateCommentDto;
    const updateData: any = {};
    
    if (content !== undefined) updateData.content = content;
    if (isActive !== undefined) updateData.isActive = isActive;

    return this.commentModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
  }

  async remove(id: string, userId: string): Promise<Comment|null> {
    const comment = await this.commentModel.findById(id);

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.userId.toString() !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    // Soft delete by setting isActive to false
    return this.commentModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );
  }

  async likeComment(commentId: string, userId: string): Promise<Comment|null> {
    const comment = await this.commentModel.findById(commentId);

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    const userObjectId = new Types.ObjectId(userId);

    // Check if user already liked
    if (comment.likedBy.includes(userObjectId)) {
      // Remove like
      return this.commentModel.findByIdAndUpdate(
        commentId,
        {
          $pull: { likedBy: userObjectId },
          $inc: { likes: -1 }
        },
        { new: true }
      );
    }

    // Remove from dislikes if exists
    let updateData: any = {
      $addToSet: { likedBy: userObjectId },
      $inc: { likes: 1 }
    };

    if (comment.dislikedBy.includes(userObjectId)) {
      updateData = {
        ...updateData,
        $pull: { dislikedBy: userObjectId },
        $inc: { ...updateData.$inc, dislikes: -1 }
      };
    }

    return this.commentModel.findByIdAndUpdate(
      commentId,
      updateData,
      { new: true }
    );
  }

  async dislikeComment(commentId: string, userId: string): Promise<Comment|null> {
    const comment = await this.commentModel.findById(commentId);

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    const userObjectId = new Types.ObjectId(userId);

    // Check if user already disliked
    if (comment.dislikedBy.includes(userObjectId)) {
      // Remove dislike
      return this.commentModel.findByIdAndUpdate(
        commentId,
        {
          $pull: { dislikedBy: userObjectId },
          $inc: { dislikes: -1 }
        },
        { new: true }
      );
    }

    // Remove from likes if exists
    let updateData: any = {
      $addToSet: { dislikedBy: userObjectId },
      $inc: { dislikes: 1 }
    };

    if (comment.likedBy.includes(userObjectId)) {
      updateData = {
        ...updateData,
        $pull: { likedBy: userObjectId },
        $inc: { ...updateData.$inc, likes: -1 }
      };
    }

    return this.commentModel.findByIdAndUpdate(
      commentId,
      updateData,
      { new: true }
    );
  }

  private addUserReactions(comments: Comment[], userId?: string): any[] {
    if (!userId) return comments;

    const userObjectId = new Types.ObjectId(userId);

    return comments.map(comment => ({
      ...comment.toObject(),
      hasLiked: comment.likedBy.includes(userObjectId),
      hasDisliked: comment.dislikedBy.includes(userObjectId)
    }));
  }
}