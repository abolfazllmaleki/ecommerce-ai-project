export enum TransactionStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
}

export enum TransactionType {
  REQUEST = 'request',
  VERIFY = 'verify',
  REFUND = 'refund',
  CHARGEBACK = 'chargeback',
}

export interface TransactionProps {
  id?: string;
  paymentId: string;
  orderId: string;
  type: TransactionType;
  amount: number;
  status?: TransactionStatus;
  gatewayResponse?: any;
  createdAt?: Date;
}

export class Transaction {
  private props: TransactionProps;

  constructor(props: TransactionProps) {
    if (!props.paymentId) throw new Error('paymentId is required');
    if (!props.orderId) throw new Error('orderId is required');
    if (!props.type) throw new Error('type is required');

    if (!Number.isFinite(props.amount) || props.amount <= 0) {
      throw new Error('invalid amount');
    }

    this.props = {
      ...props,
      status: props.status ?? TransactionStatus.PENDING,
      createdAt: props.createdAt ?? new Date(),
    };
  }

  get id() {
    return this.props.id;
  }

  get paymentId() {
    return this.props.paymentId;
  }

  get orderId() {
    return this.props.orderId;
  }

  get type() {
    return this.props.type;
  }

  get amount() {
    return this.props.amount;
  }

  get status() {
    return this.props.status;
  }

  get gatewayResponse() {
    return this.props.gatewayResponse;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  markSuccess(response?: any) {
    this.props.status = TransactionStatus.SUCCESS;
    this.props.gatewayResponse = response;
  }

  markFailed(response?: any) {
    this.props.status = TransactionStatus.FAILED;
    this.props.gatewayResponse = response;
  }

  toObject() {
    return { ...this.props };
  }
}
