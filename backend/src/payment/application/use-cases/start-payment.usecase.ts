import { Inject, Injectable } from '@nestjs/common';

import { IPaymentRepository } from '../../domain/payment.repository.port';
import { Payment } from '../../domain/payment.entity';
import { PaymentGatewayPort } from '../../domain/payment-gateway.port';

import { IOrderRepository } from '../../../orders/domain/order.repository.port';

@Injectable()
export class StartPaymentUseCase {

  constructor(
    @Inject('IPaymentRepository')
    private readonly repo: IPaymentRepository,

    @Inject('IOrderRepository')
    private readonly orderRepo: IOrderRepository,

    @Inject('PAYMENT_GATEWAY')
    private readonly gateway: PaymentGatewayPort,
  ) {}

  async execute(orderId: string) {

    const order = await this.orderRepo.findById(orderId);

    if (!order) {
      throw new Error('order not found');
    }

    const payment = new Payment({
      orderId: order.id!,
      userId: order.userId,
      amount: order.totalPrice,
      gateway: 'zarinpal'
    });

    const created = await this.repo.create(payment);

    const gatewayResult = await this.gateway.createPayment(
      created.amount,
      `${process.env.API_URL}/payments/verify`,
      `order ${created.orderId}`,
    );

    created.markInitiated(gatewayResult.authority);

    await this.repo.update(created);

    return {
      paymentUrl: gatewayResult.paymentUrl
    };
  }
}
