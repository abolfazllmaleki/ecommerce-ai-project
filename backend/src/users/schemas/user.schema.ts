import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UserRole } from '../domain/user.entity';

export { UserRole };

@Schema()
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  lastname: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.USER,
  })
  role: UserRole;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  lastLoggedIn: Date;

  @Prop({ type: [Types.ObjectId], ref: 'Product', default: [] })
  recommendations: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'Product', default: [] })
  wishList: Types.ObjectId[];

  @Prop({
    type: [
      {
        product: { type: Types.ObjectId, ref: 'Product' },
        rating: { type: Number },
      },
    ],
    default: [],
  })
  ratings: {
    product: Types.ObjectId;
    rating: number;
  }[];

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop()
  verificationToken: string;

  @Prop({ type: String })
  resetPasswordToken?: string;

  @Prop({ type: Date })
  resetPasswordExpires?: Date;

  @Prop({
    type: [
      {
        product: { type: Types.ObjectId, ref: 'Product' },
        interactionType: { type: String },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  interactionHistory: {
    product: Types.ObjectId;
    interactionType: string;
    timestamp: Date;
  }[];

  @Prop({ type: [String], default: [] })
  preferredCategories: string[];

  @Prop({ default: 0 })
  engagementScore: number;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
