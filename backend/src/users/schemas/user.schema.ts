import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';
import { Product } from '../../products/schemas/product.schema';
import { Order } from '../../orders/schemas/order.schema';

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

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  lastLoggedIn: Date;

  @Prop({ default: 'user' })
  role: string;

  @Prop({ type: [Types.ObjectId], ref: 'Product', default: [] })
  recommendations: Product[];

  @Prop({ type: [Types.ObjectId], ref: 'Product', default: [] })
  wishList: Product[];

  // @Prop({ type: [Types.ObjectId], ref: 'Order', default: [] })
  // pendingOrders: Order[];

  // @Prop({ type: [Types.ObjectId], ref: 'Order', default: [] })
  // canceledOrders: Order[];

  // @Prop({ type: [Types.ObjectId], ref: 'Order', default: [] })
  // purchaseHistory: Order[];

  // @Prop({
  //   type: [
  //     {
  //       product: { type: Types.ObjectId, ref: 'Product' },
  //       interactionType: { type: String },
  //       timestamp: { type: Date },
  //     },
  //   ],
  //   default: [],
  // })
  // interactionHistory: {
  //   product: Product;
  //   interactionType: string;
  //   timestamp: Date;
  // }[];

  // @Prop({ type: [String], default: [] })
  // preferredCategories: string[];

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

  // @Prop({ type: Number, default: 0 })
  // engagementScore: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
