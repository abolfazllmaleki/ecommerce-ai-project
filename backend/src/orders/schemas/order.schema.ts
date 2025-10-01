// order.schema.ts
import { Schema, Document, Types } from 'mongoose';

export const OrderSchema = new Schema({
  userId: { type: String, required: true },
  products: [
    {
      productId: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      name: { type: String, required: true }
    },
  ],
  totalPrice: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], 
    default: 'pending' 
  },
  shippingAddress: {
    firstName: { type: String, required: true },
    lastName: { type: String, default: '' },
    companyName: { type: String, default: '' },
    streetAddress: { type: String, required: true },
    apartment: { type: String, default: '' },
    city: { type: String, required: true },
    state: { type: String, default: '' },
    postalCode: { type: String, default: '' },
    country: { type: String, default: 'US' }
  },
  contactInfo: {
    phone: { type: String, required: true },
    email: { type: String, required: true }
  },
  paymentMethod: { 
    type: String, 
    enum: ['visa', 'mastercard', 'paypal', 'cash_on_delivery'], 
    required: true 
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  orderDate: { type: Date, default: Date.now },
  shippedDate: { type: Date },
  deliveredDate: { type: Date }
});

export interface Order extends Document {
  userId: string;
  products: {
    productId: string;
    quantity: number;
    price: number;
    name: string;
  }[];
  totalPrice: number;
  status: string;
  shippingAddress: {
    firstName: string;
    lastName?: string;
    companyName?: string;
    streetAddress: string;
    apartment?: string;
    city: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  contactInfo: {
    phone: string;
    email: string;
  };
  paymentMethod: string;
  paymentStatus: string;
  orderDate: Date;
  shippedDate?: Date;
  deliveredDate?: Date;
}

export interface CreateOrderDto {
  userId: string;
  products: {
    productId: string;
    quantity: number;
    price: number;
    name: string;
  }[];
  totalPrice: number;
  shippingAddress: {
    firstName: string;
    lastName?: string;
    companyName?: string;
    streetAddress: string;
    apartment?: string;
    city: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  contactInfo: {
    phone: string;
    email: string;
  };
  paymentMethod: string;
}