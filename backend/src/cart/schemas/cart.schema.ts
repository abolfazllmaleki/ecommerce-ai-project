import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Product } from '../../products/schemas/product.schema';

@Schema({ timestamps: true })
export class Cart extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  user: Types.ObjectId;

  @Prop({
    type: [
      {
        product: { type: Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, default: 1, min: 1 },
        price: { type: Number, required: true },
        addedAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
    validate: [arrayLimit, 'Cart items limit exceeded (max 20 items)'],
  })
  items: {
    product: Types.ObjectId;
    quantity: number;
    price: number;
    addedAt: Date;
  }[];

  @Prop({ default: 0 })
  total: number;
}

function arrayLimit(val) {
  return val.length <= 20;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
