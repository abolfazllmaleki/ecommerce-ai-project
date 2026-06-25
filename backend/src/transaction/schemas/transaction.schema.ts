import { Schema, Document } from 'mongoose';

export const TransactionSchema = new Schema(
  {
    paymentId: { type: String, required: true, index: true },
    orderId: { type: String, required: true, index: true },

    type: {
      type: String,
      enum: ['request', 'verify', 'refund', 'chargeback'],
      required: true,
      index: true,
    },

    amount: { type: Number, required: true },

    status: {
      type: String,
      enum: ['pending', 'success', 'failed'],
      default: 'pending',
      index: true,
    },

    gatewayResponse: { type: Schema.Types.Mixed },

    createdAt: { type: Date, default: Date.now, index: true },
  },
  {
    versionKey: false,
  },
);

TransactionSchema.index({ paymentId: 1, type: 1, createdAt: -1 });

TransactionSchema.index(
  { paymentId: 1, type: 1 },
  {
    unique: true,
    partialFilterExpression: {
      type: 'request',
    },
    name: 'unique_request_transaction_per_payment',
  },
);

export interface Transaction extends Document {}
