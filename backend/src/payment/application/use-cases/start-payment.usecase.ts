import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { IPaymentRepository } from '../../domain/payment.repository.port';
import { Payment } from '../../domain/payment.entity';
import { PaymentGatewayPort } from '../../domain/payment-gateway.port';

import { IOrderRepository } from '../../../orders/domain/order.repository.port';

import { CreateTransactionUseCase } from '../../../transaction/application/use-cases/create-transaction.usecase';
import {
  TransactionStatus,
  TransactionType,
} from '../../../transaction/domain/transaction.entity';

interface StartPaymentInput {
  orderId: string;
  userId?: string;
}

@Injectable()
export class StartPaymentUseCase {
  constructor(
    @Inject('IPaymentRepository')
    private readonly paymentRepo: IPaymentRepository,

    @Inject('IOrderRepository')
    private readonly orderRepo: IOrderRepository,

    @Inject('PAYMENT_GATEWAY')
    private readonly gateway: PaymentGatewayPort,

    private readonly createTransaction: CreateTransactionUseCase,
  ) {}

  async execute(input: StartPaymentInput) {
    const order = await this.orderRepo.findById(input.orderId);

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    if (input.userId && order.userId !== input.userId) {
      throw new ForbiddenException('You cannot pay this order');
    }

    if (this.isOrderPaid(order.paymentStatus)) {
      throw new BadRequestException('Order already paid');
    }

    const activePayment = await this.paymentRepo.findActiveByOrderId(order.id!);

    if (activePayment && activePayment.isExpired()) {
      activePayment.markExpired();
      await this.paymentRepo.update(activePayment);
    }

    if (activePayment && !activePayment.isExpired()) {
      if (activePayment.paymentUrl) {
        return {
          paymentId: activePayment.id,
          orderId: activePayment.orderId,
          authority: activePayment.authority,
          paymentUrl: activePayment.paymentUrl,
          reused: true,
        };
      }

      throw new ConflictException('Payment is already being started');
    }

    const payment = new Payment({
      orderId: order.id!,
      userId: order.userId,
      amount: order.totalPrice,
      gateway: 'zarinpal',
    });

    let createdPayment: Payment;

    try {
      createdPayment = await this.paymentRepo.create(payment);
    } catch (error) {
      if (error?.code === 11000) {
        const existingPayment = await this.paymentRepo.findActiveByOrderId(
          order.id!,
        );

        if (existingPayment?.paymentUrl) {
          return {
            paymentId: existingPayment.id,
            orderId: existingPayment.orderId,
            authority: existingPayment.authority,
            paymentUrl: existingPayment.paymentUrl,
            reused: true,
          };
        }

        throw new ConflictException('Payment is already being started');
      }

      throw error;
    }

    try {
      const callbackUrl = `${process.env.BACKEND_URL}/payments/verify`;

      const gatewayResult = await this.gateway.createPayment(
        createdPayment.amount,
        callbackUrl,
        `Order ${createdPayment.orderId}`,
      );

      createdPayment.markInitiated(
        gatewayResult.authority,
        gatewayResult.paymentUrl,
      );

      createdPayment.gatewayRawResponse = gatewayResult.rawResponse;

      const updatedPayment = await this.paymentRepo.update(createdPayment);

      await this.createTransaction.execute({
        paymentId: updatedPayment.id!,
        orderId: updatedPayment.orderId,
        amount: updatedPayment.amount,
        type: TransactionType.REQUEST,
        status: TransactionStatus.SUCCESS,
        gatewayResponse: gatewayResult.rawResponse,
      });

      if (typeof order.updatePaymentStatus === 'function') {
        order.updatePaymentStatus('pending');
        await this.orderRepo.update(order);
      }

      return {
        paymentId: updatedPayment.id,
        orderId: updatedPayment.orderId,
        authority: updatedPayment.authority,
        paymentUrl: updatedPayment.paymentUrl,
        reused: false,
      };
    } catch (error) {
      createdPayment.markFailed(
        'gateway_create_payment_failed',
        error?.response?.data ?? error.message,
      );

      await this.paymentRepo.update(createdPayment);

      await this.createTransaction.execute({
        paymentId: createdPayment.id!,
        orderId: createdPayment.orderId,
        amount: createdPayment.amount,
        type: TransactionType.REQUEST,
        status: TransactionStatus.FAILED,
        gatewayResponse: error?.response?.data ?? { message: error.message },
      });

      throw new InternalServerErrorException('Payment could not be started');
    }
  }

  private isOrderPaid(paymentStatus: string): boolean {
    return ['paid', 'completed'].includes(paymentStatus);
  }
}
