export type PaymentStatus =
  | 'pending'
  | 'initiated'
  | 'completed'
  | 'failed'
  | 'refunded';

export interface PaymentProps {
  id?: string | null;
  orderId: string;
  userId: string;
  amount: number;
  gateway: string;
  authority?: string;
  transactionId?: string;
  status?: PaymentStatus;
  createdAt?: Date;
  paidAt?: Date;
}

export class Payment {
  public readonly id: string | null;
  public orderId: string;
  public userId: string;
  public amount: number;
  public gateway: string;
  public authority?: string;
  public transactionId?: string;
  public status: PaymentStatus;
  public createdAt: Date;
  public paidAt?: Date;

  constructor(props: PaymentProps) {
    if (!props.orderId) throw new Error('orderId required');
    if (props.amount <= 0) throw new Error('invalid amount');

    this.id = props.id ?? null;
    this.orderId = props.orderId;
    this.userId = props.userId;
    this.amount = props.amount;
    this.gateway = props.gateway;
    this.authority = props.authority;
    this.transactionId = props.transactionId;
    this.status = props.status ?? 'pending';
    this.createdAt = props.createdAt ?? new Date();
    this.paidAt = props.paidAt;
  }

  markInitiated(authority: string) {
    this.authority = authority;
    this.status = 'initiated';
  }

  markCompleted(transactionId: string) {
    this.transactionId = transactionId;
    this.status = 'completed';
    this.paidAt = new Date();
  }

  markFailed() {
    this.status = 'failed';
  }

  isCompleted(): boolean {
  return this.status === 'completed';
    }
}
