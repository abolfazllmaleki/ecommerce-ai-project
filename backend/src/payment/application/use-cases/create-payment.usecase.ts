import { Inject, Injectable, BadRequestException } from '@nestjs/common';

import { IPaymentRepository } from '../../domain/payment.repository.port';
import { Payment } from '../../domain/payment.entity';
import { PaymentGatewayPort } from '../../domain/payment-gateway.port';

import { IOrderRepository } from '../../../orders/domain/order.repository.port';

import { CreateTransactionUseCase } from '../../../transaction/application/use-cases/create-transaction.usecase';
import { TransactionType } from 'src/transaction/domain/transaction.entity';
@Injectable()
export class StartPaymentUseCase {

  constructor(
    @Inject('IPaymentRepository')
    private readonly repo: IPaymentRepository,

    @Inject('IOrderRepository')
    private readonly orderRepo: IOrderRepository,

    @Inject('PAYMENT_GATEWAY')
    private readonly gateway: PaymentGatewayPort,

    private readonly createTransaction: CreateTransactionUseCase
  ) {}

  async execute(orderId: string) {

    const order = await this.orderRepo.findById(orderId);

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    if (order.paymentStatus === 'completed') {
      throw new BadRequestException('Order already paid');
    }

    const payment = new Payment({
      orderId: order.id!,
      userId: order.userId,
      amount: order.totalPrice,
      gateway: 'zarinpal',
    });

    const createdPayment = await this.repo.create(payment);

    // ✅ transaction request
    await this.createTransaction.execute({
      paymentId: createdPayment.id!,
      orderId: createdPayment.orderId,
      amount: createdPayment.amount,
      type: TransactionType.REQUEST
    });

    const callbackUrl =
      `${process.env.API_URL}/payments/verify?orderId=${order.id}`;

    const gatewayResult = await this.gateway.createPayment(
      createdPayment.amount,
      callbackUrl,
      `Order ${createdPayment.orderId}`
    );

    createdPayment.markInitiated(gatewayResult.authority);

    await this.repo.update(createdPayment);

    return {
      paymentUrl: gatewayResult.paymentUrl,
      authority: gatewayResult.authority
    };
  }
}
