import { Schema, Document } from 'mongoose';

export const PaymentSchema = new Schema(
  {
    orderId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },

    amount: { type: Number, required: true },

    gateway: { type: String, required: true, index: true },

    authority: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },

    paymentUrl: { type: String },

    transactionId: {
      type: String,
      index: true,
      sparse: true,
    },

    status: {
      type: String,
      enum: [
        'pending',
        'initiated',
        'verifying',
        'completed',
        'failed',
        'expired',
        'refunded',
      ],
      default: 'pending',
      index: true,
    },

    failureReason: { type: String },
    gatewayRawResponse: { type: Schema.Types.Mixed },

    createdAt: { type: Date, default: Date.now },
    initiatedAt: { type: Date },
    paidAt: { type: Date },
    failedAt: { type: Date },
    expiresAt: { type: Date },
  },
  {
    versionKey: false,
  },
);

PaymentSchema.index({ orderId: 1, status: 1 });
PaymentSchema.index({ userId: 1, createdAt: -1 });

PaymentSchema.index(
  { orderId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: { $in: ['pending', 'initiated', 'verifying'] },
    },
    name: 'unique_active_payment_per_order',
  },
);

export interface Payment extends Document {}
