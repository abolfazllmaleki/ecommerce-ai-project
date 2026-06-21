import { Schema } from 'mongoose';

export const TransactionSchema = new Schema({

  paymentId: {
    type: String,
    required: true,
    index: true
  },

  orderId: {
    type: String,
    required: true,
    index: true
  },

  type: {
    type: String,
    enum: ['request','verify','refund','chargeback']
  },

  amount: Number,

  status: {
    type: String,
    enum: ['pending','success','failed']
  },

  gatewayResponse: Schema.Types.Mixed,

  createdAt: {
    type: Date,
    default: Date.now
  }

});
