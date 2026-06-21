import { Schema, Document } from 'mongoose';

export const PaymentSchema = new Schema({
  orderId: { type: String, required: true, index: true },
  userId: { type: String, required: true },

  amount: { type: Number, required: true },

  gateway: { type: String, required: true },

  authority: { type: String, unique: true, sparse: true },

  transactionId: { type: String },

  status: {
    type: String,
    enum: ['pending', 'initiated', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },

  createdAt: { type: Date, default: Date.now },
  paidAt: { type: Date }
});

export interface Payment extends Document {}
