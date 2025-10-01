import { Document, Types } from 'mongoose';

export interface IComment extends Document {
  userId: Types.ObjectId;
  productId: Types.ObjectId;
  content: string;
  likes: number;
  dislikes: number;
  isActive: boolean;
  likedBy: Types.ObjectId[];
  dislikedBy: Types.ObjectId[];
  parentCommentId?: Types.ObjectId;
  depth: number;
  replyCount: number;
  createdAt: Date;
  updatedAt: Date;
}