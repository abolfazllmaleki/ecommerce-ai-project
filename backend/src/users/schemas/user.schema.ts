import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';
import { Product } from '../../products/schemas/product.schema';
import { Order } from '../../orders/schemas/order.schema';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
}

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
    default: UserRole.USER 
  })
  role: UserRole;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  lastLoggedIn: Date;



  @Prop({ type: [Types.ObjectId], ref: 'Product', default: [] })
  recommendations: Product[];

  @Prop({ type: [Types.ObjectId], ref: 'Product', default: [] })
  wishList: Product[];


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


}

export const UserSchema = SchemaFactory.createForClass(User);
