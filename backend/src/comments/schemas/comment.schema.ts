import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Comment extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ required: true, minlength: 1, maxlength: 1000 })
  content: string;

  @Prop({ default: 0, min: 0 })
  likes: number;

  @Prop({ default: 0, min: 0 })
  dislikes: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  likedBy: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  dislikedBy: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'Comment', default: null })
  parentCommentId: Types.ObjectId;

  @Prop({ default: 0 })
  depth: number;

  @Prop({ default: 0 })
  replyCount: number;

  createdAt: Date;
  updatedAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

CommentSchema.index({ productId: 1, createdAt: -1 });
CommentSchema.index({ userId: 1, productId: 1 });
CommentSchema.index({ parentCommentId: 1 });
CommentSchema.index({ depth: 1 });