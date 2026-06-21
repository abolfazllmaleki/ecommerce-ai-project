

export enum TransactionStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed'
}

export enum TransactionType {
  REQUEST = 'request',
  VERIFY = 'verify',
  REFUND = 'refund',
  CHARGEBACK = 'chargeback'
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

    if (!props.paymentId) {
      throw new Error('paymentId is required');
    }

    this.props = {
      ...props,
      status: props.status || TransactionStatus.PENDING,
      createdAt: props.createdAt || new Date()
    };
  }

  get id() {
    return this.props.id;
  }

  get paymentId() {
    return this.props.paymentId;
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
