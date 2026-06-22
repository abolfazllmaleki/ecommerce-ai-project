export type PaymentStatus =
  | 'pending'
  | 'initiated'
  | 'verifying'
  | 'completed'
  | 'failed'
  | 'expired'
  | 'refunded';

export interface PaymentProps {
  id?: string | null;
  orderId: string;
  userId: string;
  amount: number;
  gateway: string;
  authority?: string;
  paymentUrl?: string;
  transactionId?: string;
  status?: PaymentStatus;
  failureReason?: string;
  gatewayRawResponse?: any;
  createdAt?: Date;
  initiatedAt?: Date;
  paidAt?: Date;
  failedAt?: Date;
  expiresAt?: Date;
}

export class Payment {
  public readonly id: string | null;
  public orderId: string;
  public userId: string;
  public amount: number;
  public gateway: string;
  public authority?: string;
  public paymentUrl?: string;
  public transactionId?: string;
  public status: PaymentStatus;
  public failureReason?: string;
  public gatewayRawResponse?: any;
  public createdAt: Date;
  public initiatedAt?: Date;
  public paidAt?: Date;
  public failedAt?: Date;
  public expiresAt?: Date;

  constructor(props: PaymentProps) {
    if (!props.orderId) throw new Error('orderId required');
    if (!props.userId) throw new Error('userId required');
    if (!props.gateway) throw new Error('gateway required');

    if (!Number.isFinite(props.amount) || props.amount <= 0) {
      throw new Error('invalid amount');
    }

    this.id = props.id ?? null;
    this.orderId = props.orderId;
    this.userId = props.userId;
    this.amount = props.amount;
    this.gateway = props.gateway;
    this.authority = props.authority;
    this.paymentUrl = props.paymentUrl;
    this.transactionId = props.transactionId;
    this.status = props.status ?? 'pending';
    this.failureReason = props.failureReason;
    this.gatewayRawResponse = props.gatewayRawResponse;
    this.createdAt = props.createdAt ?? new Date();
    this.initiatedAt = props.initiatedAt;
    this.paidAt = props.paidAt;
    this.failedAt = props.failedAt;
    this.expiresAt = props.expiresAt;
  }

  markInitiated(authority: string, paymentUrl: string) {
    if (this.status !== 'pending') {
      throw new Error(`cannot initiate payment from status ${this.status}`);
    }

    this.authority = authority;
    this.paymentUrl = paymentUrl;
    this.status = 'initiated';
    this.initiatedAt = new Date();
    this.expiresAt = new Date(Date.now() + 30 * 60 * 1000);
  }

  markVerifying() {
    if (this.status !== 'initiated') {
      throw new Error(`cannot verify payment from status ${this.status}`);
    }

    this.status = 'verifying';
  }

  markCompleted(transactionId: string, gatewayRawResponse?: any) {
    if (!transactionId) throw new Error('transactionId required');

    if (this.status === 'refunded') {
      throw new Error('refunded payment cannot be completed');
    }

    this.transactionId = transactionId;
    this.status = 'completed';
    this.paidAt = new Date();
    this.failureReason = undefined;
    this.gatewayRawResponse = gatewayRawResponse;
  }

  markFailed(reason?: string, gatewayRawResponse?: any) {
    if (this.status === 'completed') {
      throw new Error('completed payment cannot be failed');
    }

    if (this.status === 'refunded') {
      throw new Error('refunded payment cannot be failed');
    }

    this.status = 'failed';
    this.failureReason = reason;
    this.failedAt = new Date();
    this.gatewayRawResponse = gatewayRawResponse;
  }

  markExpired() {
    if (this.status === 'completed') {
      throw new Error('completed payment cannot be expired');
    }

    this.status = 'expired';
    this.failureReason = 'payment_expired';
  }

  markRefunded() {
    if (this.status !== 'completed') {
      throw new Error('only completed payment can be refunded');
    }

    this.status = 'refunded';
  }

  isCompleted(): boolean {
    return this.status === 'completed';
  }

  isActive(): boolean {
    return ['pending', 'initiated', 'verifying'].includes(this.status);
  }

  isExpired(): boolean {
    return Boolean(this.expiresAt && this.expiresAt.getTime() < Date.now());
  }
}
