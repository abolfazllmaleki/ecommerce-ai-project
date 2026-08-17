import { FailPaymentUseCase } from './fail-payment.usecase';
import { IPaymentRepository } from '../../domain/payment.repository.port';
import { CreateTransactionUseCase } from '../../../transaction/application/use-cases/create-transaction.usecase';
import { EventPublisher } from '../../../shared/messaging/application/ports/event-publisher.port';
import {
  TransactionStatus,
  TransactionType,
} from '../../../transaction/domain/transaction.entity';
import { BadRequestException } from '@nestjs/common';

describe('FailPaymentUseCase', () => {
  let usecase: FailPaymentUseCase;
  let paymentRepo: jest.Mocked<IPaymentRepository>;
  let createTransaction: jest.Mocked<CreateTransactionUseCase>;
  let eventPublisher: jest.Mocked<EventPublisher>;

  beforeEach(() => {
    paymentRepo = {
      findById: jest.fn(),
      update: jest.fn(),
    } as any;

    createTransaction = {
      execute: jest.fn(),
    } as any;

    eventPublisher = {
      publish: jest.fn(),
    } as any;

    usecase = new FailPaymentUseCase(
      paymentRepo,
      createTransaction,
      eventPublisher,
    );
  });

  it('should fail the payment, record a transaction and publish payment.failed', async () => {
    const payment = {
      id: 'pay-1',
      isCompleted: jest.fn().mockReturnValue(false),
      markFailed: jest.fn(),
    };

    const updatedPayment = {
      id: 'pay-1',
      orderId: 'order-1',
      userId: 'user-1',
      amount: 1000,
    };

    paymentRepo.findById.mockResolvedValue(payment as any);
    paymentRepo.update.mockResolvedValue(updatedPayment as any);

    await expect(
      usecase.execute('pay-1', 'user_cancelled'),
    ).resolves.toEqual({
      success: false,
      paymentId: 'pay-1',
      reason: 'user_cancelled',
    });

    expect(payment.markFailed).toHaveBeenCalledWith('user_cancelled');

    expect(paymentRepo.update).toHaveBeenCalledWith(payment);

    expect(createTransaction.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        paymentId: 'pay-1',
        orderId: 'order-1',
        amount: 1000,
        type: TransactionType.VERIFY,
        status: TransactionStatus.FAILED,
        gatewayResponse: { reason: 'user_cancelled' },
      }),
    );

    expect(eventPublisher.publish).toHaveBeenCalledWith({
      eventId: expect.any(String),
      name: 'payment.failed',
      version: 1,
      occurredAt: expect.any(String),
      payload: {
        paymentId: 'pay-1',
        orderId: 'order-1',
        userId: 'user-1',
        amount: 1000,
        reason: 'user_cancelled',
      },
    });
  });

  it('should default the reason to manual_fail', async () => {
    const payment = {
      id: 'pay-1',
      isCompleted: jest.fn().mockReturnValue(false),
      markFailed: jest.fn(),
    };

    const updatedPayment = {
      id: 'pay-1',
      orderId: 'order-1',
      userId: 'user-1',
      amount: 1000,
    };

    paymentRepo.findById.mockResolvedValue(payment as any);
    paymentRepo.update.mockResolvedValue(updatedPayment as any);

    await expect(usecase.execute('pay-1')).resolves.toEqual({
      success: false,
      paymentId: 'pay-1',
      reason: 'manual_fail',
    });

    expect(payment.markFailed).toHaveBeenCalledWith('manual_fail');
  });

  it('should throw BadRequestException when the payment does not exist', async () => {
    paymentRepo.findById.mockResolvedValue(null);

    await expect(usecase.execute('pay-1')).rejects.toThrow(
      new BadRequestException('Payment not found'),
    );

    expect(paymentRepo.update).not.toHaveBeenCalled();
    expect(createTransaction.execute).not.toHaveBeenCalled();
    expect(eventPublisher.publish).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when the payment is already completed', async () => {
    const payment = {
      id: 'pay-1',
      isCompleted: jest.fn().mockReturnValue(true),
      markFailed: jest.fn(),
    };

    paymentRepo.findById.mockResolvedValue(payment as any);

    await expect(usecase.execute('pay-1')).rejects.toThrow(
      new BadRequestException('Payment already completed'),
    );

    expect(payment.markFailed).not.toHaveBeenCalled();
    expect(paymentRepo.update).not.toHaveBeenCalled();
    expect(eventPublisher.publish).not.toHaveBeenCalled();
  });
});
