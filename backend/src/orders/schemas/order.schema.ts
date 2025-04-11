import { Schema, Document } from 'mongoose';

export const OrderSchema = new Schema({
  userId: { type: String, required: true },
  products: [
    {
      productId: { type: String, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
});

export interface Order extends Document {
  userId: string;
  products: { productId: string; quantity: number }[];
  totalPrice: number;
  status: string;
}
