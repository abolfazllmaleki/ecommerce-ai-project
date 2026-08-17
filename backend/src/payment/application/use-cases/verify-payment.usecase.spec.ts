import { VerifyPaymentUseCase } from './verify-payment.usecase';
import { IPaymentRepository } from '../../domain/payment.repository.port';
import { PaymentGatewayPort } from '../../domain/payment-gateway.port';
import { IOrderRepository } from '../../../orders/domain/order.repository.port';
import { CreateTransactionUseCase } from '../../../transaction/application/use-cases/create-transaction.usecase';
import { EventPublisher } from '../../../shared/messaging/application/ports/event-publisher.port';
import {
  TransactionStatus,
  TransactionType,
} from '../../../transaction/domain/transaction.entity';
import { BadRequestException, ConflictException } from '@nestjs/common';

describe('VerifyPaymentUseCase', () => {
  let usecase: VerifyPaymentUseCase;
  let paymentRepo: jest.Mocked<IPaymentRepository>;
  let gateway: jest.Mocked<PaymentGatewayPort>;
  let orderRepo: jest.Mocked<IOrderRepository>;
  let createTransaction: jest.Mocked<CreateTransactionUseCase>;
  let eventPublisher: jest.Mocked<EventPublisher>;

  beforeEach(() => {
    paymentRepo = {
      findByAuthority: jest.fn(),
      acquireForVerification: jest.fn(),
      update: jest.fn(),
    } as any;

    gateway = {
      verifyPayment: jest.fn(),
    } as any;

    orderRepo = {
      findById: jest.fn(),
      update: jest.fn(),
    } as any;

    createTransaction = {
      execute: jest.fn(),
    } as any;

    eventPublisher = {
      publish: jest.fn(),
    } as any;

    usecase = new VerifyPaymentUseCase(
      paymentRepo,
      gateway,
      orderRepo,
      createTransaction,
      eventPublisher,
    );
  });

  it('should throw BadRequestException when the payment does not exist', async () => {
    paymentRepo.findByAuthority.mockResolvedValue(null);

    await expect(usecase.execute({ authority: 'auth-1' })).rejects.toThrow(
      new BadRequestException('Payment not found'),
    );

    expect(gateway.verifyPayment).not.toHaveBeenCalled();
  });

  it('should return an already verified result when the payment is completed', async () => {
    const payment = {
      id: 'pay-1',
      orderId: 'order-1',
      transactionId: 'txn-1',
      isCompleted: jest.fn().mockReturnValue(true),
    };

    paymentRepo.findByAuthority.mockResolvedValue(payment as any);

    await expect(usecase.execute({ authority: 'auth-1' })).resolves.toEqual({
      success: true,
      alreadyVerified: true,
      paymentId: 'pay-1',
      orderId: 'order-1',
      transactionId: 'txn-1',
    });

    expect(paymentRepo.acquireForVerification).not.toHaveBeenCalled();
  });

  it('should throw ConflictException when verification is already in progress', async () => {
    const payment = {
      status: 'verifying',
      isCompleted: jest.fn().mockReturnValue(false),
    };

    paymentRepo.findByAuthority.mockResolvedValue(payment as any);

    await expect(usecase.execute({ authority: 'auth-1' })).rejects.toThrow(
      new ConflictException('Payment verification is already in progress'),
    );
  });

  it('should mark an expired payment as expired and publish payment.failed', async () => {
    const payment = {
      id: 'pay-1',
      orderId: 'order-1',
      userId: 'user-1',
      amount: 1000,
      status: 'initiated',
      isCompleted: jest.fn().mockReturnValue(false),
      isExpired: jest.fn().mockReturnValue(true),
      markExpired: jest.fn(),
    };

    const updatedPayment = {
      id: 'pay-1',
      orderId: 'order-1',
      userId: 'user-1',
      amount: 1000,
    };

    paymentRepo.findByAuthority.mockResolvedValue(payment as any);
    paymentRepo.update.mockResolvedValue(updatedPayment as any);

    await expect(usecase.execute({ authority: 'auth-1' })).resolves.toEqual({
      success: false,
      reason: 'payment_expired',
      paymentId: 'pay-1',
      orderId: 'order-1',
    });

    expect(payment.markExpired).toHaveBeenCalled();

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
        reason: 'payment_expired',
      },
    });

    expect(paymentRepo.acquireForVerification).not.toHaveBeenCalled();
  });

  it('should fail the payment when the gateway callback status is not OK', async () => {
    const payment = {
      id: 'pay-1',
      orderId: 'order-1',
      userId: 'user-1',
      amount: 1000,
      status: 'initiated',
      isCompleted: jest.fn().mockReturnValue(false),
      isExpired: jest.fn().mockReturnValue(false),
      markFailed: jest.fn(),
    };

    const updatedPayment = {
      id: 'pay-1',
      orderId: 'order-1',
      userId: 'user-1',
      amount: 1000,
    };

    paymentRepo.findByAuthority.mockResolvedValue(payment as any);
    paymentRepo.update.mockResolvedValue(updatedPayment as any);

    await expect(
      usecase.execute({ authority: 'auth-1', callbackStatus: 'NOK' }),
    ).resolves.toEqual({
      success: false,
      reason: 'payment_cancelled_or_failed',
      paymentId: 'pay-1',
      orderId: 'order-1',
    });

    expect(payment.markFailed).toHaveBeenCalledWith('gateway_callback_not_ok', {
      callbackStatus: 'NOK',
    });

    expect(createTransaction.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        paymentId: 'pay-1',
        orderId: 'order-1',
        amount: 1000,
        type: TransactionType.VERIFY,
        status: TransactionStatus.FAILED,
        gatewayResponse: { callbackStatus: 'NOK' },
      }),
    );

    expect(eventPublisher.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'payment.failed',
        payload: expect.objectContaining({
          reason: 'payment_cancelled_or_failed',
        }),
      }),
    );

    expect(gateway.verifyPayment).not.toHaveBeenCalled();
  });

  it('should return an already verified result when acquisition fails but the refresh is completed', async () => {
    const existingPayment = {
      isCompleted: jest.fn().mockReturnValue(false),
      isExpired: jest.fn().mockReturnValue(false),
      status: 'initiated',
    };

    const refreshedPayment = {
      id: 'pay-1',
      orderId: 'order-1',
      transactionId: 'txn-1',
      isCompleted: jest.fn().mockReturnValue(true),
    };

    paymentRepo.findByAuthority
      .mockResolvedValueOnce(existingPayment as any)
      .mockResolvedValueOnce(refreshedPayment as any);
    paymentRepo.acquireForVerification.mockResolvedValue(null);

    await expect(usecase.execute({ authority: 'auth-1' })).resolves.toEqual({
      success: true,
      alreadyVerified: true,
      paymentId: 'pay-1',
      orderId: 'order-1',
      transactionId: 'txn-1',
    });

    expect(gateway.verifyPayment).not.toHaveBeenCalled();
  });

  it('should throw ConflictException when the payment cannot be acquired for verification', async () => {
    const existingPayment = {
      isCompleted: jest.fn().mockReturnValue(false),
      isExpired: jest.fn().mockReturnValue(false),
      status: 'initiated',
    };

    const refreshedPayment = {
      isCompleted: jest.fn().mockReturnValue(false),
    };

    paymentRepo.findByAuthority
      .mockResolvedValueOnce(existingPayment as any)
      .mockResolvedValueOnce(refreshedPayment as any);
    paymentRepo.acquireForVerification.mockResolvedValue(null);

    await expect(usecase.execute({ authority: 'auth-1' })).rejects.toThrow(
      new ConflictException('Payment cannot be acquired for verification'),
    );
  });

  it('should return a retryable result when the gateway reports a retryable failure', async () => {
    const existingPayment = {
      isCompleted: jest.fn().mockReturnValue(false),
      isExpired: jest.fn().mockReturnValue(false),
      status: 'initiated',
    };

    const payment = {
      id: 'pay-1',
      orderId: 'order-1',
      userId: 'user-1',
      amount: 1000,
    };

    paymentRepo.findByAuthority.mockResolvedValue(existingPayment as any);
    paymentRepo.acquireForVerification.mockResolvedValue(payment as any);
    gateway.verifyPayment.mockResolvedValue({
      success: false,
      retryable: true,
      message: 'temporary_error',
      rawResponse: { code: -1 },
    });

    await expect(usecase.execute({ authority: 'auth-1' })).resolves.toEqual({
      success: false,
      retryable: true,
      reason: 'temporary_error',
      paymentId: 'pay-1',
      orderId: 'order-1',
    });

    expect(createTransaction.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        type: TransactionType.VERIFY,
        status: TransactionStatus.FAILED,
      }),
    );

    expect(paymentRepo.update).not.toHaveBeenCalled();
    expect(eventPublisher.publish).not.toHaveBeenCalled();
  });

  it('should fail the payment when the gateway reports a non-retryable failure', async () => {
    const existingPayment = {
      isCompleted: jest.fn().mockReturnValue(false),
      isExpired: jest.fn().mockReturnValue(false),
      status: 'initiated',
    };

    const payment = {
      id: 'pay-1',
      orderId: 'order-1',
      userId: 'user-1',
      amount: 1000,
      markFailed: jest.fn(),
    };

    const updatedPayment = {
      id: 'pay-1',
      orderId: 'order-1',
      userId: 'user-1',
      amount: 1000,
    };

    paymentRepo.findByAuthority.mockResolvedValue(existingPayment as any);
    paymentRepo.acquireForVerification.mockResolvedValue(payment as any);
    gateway.verifyPayment.mockResolvedValue({
      success: false,
      retryable: false,
      message: 'declined',
      rawResponse: { code: 100 },
    });
    paymentRepo.update.mockResolvedValue(updatedPayment as any);

    await expect(usecase.execute({ authority: 'auth-1' })).resolves.toEqual({
      success: false,
      reason: 'declined',
      paymentId: 'pay-1',
      orderId: 'order-1',
    });

    expect(payment.markFailed).toHaveBeenCalledWith('declined', { code: 100 });

    expect(createTransaction.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        type: TransactionType.VERIFY,
        status: TransactionStatus.FAILED,
      }),
    );

    expect(eventPublisher.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'payment.failed',
        payload: expect.objectContaining({ reason: 'declined' }),
      }),
    );
  });

  it('should complete the payment, update the order and publish payment.succeeded', async () => {
    const existingPayment = {
      isCompleted: jest.fn().mockReturnValue(false),
      isExpired: jest.fn().mockReturnValue(false),
      status: 'initiated',
    };

    const payment = {
      id: 'pay-1',
      orderId: 'order-1',
      userId: 'user-1',
      amount: 1000,
      markCompleted: jest.fn(),
    };

    const updatedPayment = {
      id: 'pay-1',
      orderId: 'order-1',
      userId: 'user-1',
      amount: 1000,
      transactionId: 'txn-1',
    };

    const order = {
      id: 'order-1',
      paymentStatus: 'pending',
      updatePaymentStatus: jest.fn(),
    };

    paymentRepo.findByAuthority.mockResolvedValue(existingPayment as any);
    paymentRepo.acquireForVerification.mockResolvedValue(payment as any);
    gateway.verifyPayment.mockResolvedValue({
      success: true,
      transactionId: 'txn-1',
      rawResponse: { code: 100 },
    });
    paymentRepo.update.mockResolvedValue(updatedPayment as any);
    orderRepo.findById.mockResolvedValue(order as any);
    orderRepo.update.mockResolvedValue(order as any);

    await expect(usecase.execute({ authority: 'auth-1' })).resolves.toEqual({
      success: true,
      alreadyVerified: false,
      paymentId: 'pay-1',
      orderId: 'order-1',
      transactionId: 'txn-1',
    });

    expect(payment.markCompleted).toHaveBeenCalledWith('txn-1', { code: 100 });

    expect(createTransaction.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        paymentId: 'pay-1',
        orderId: 'order-1',
        amount: 1000,
        type: TransactionType.VERIFY,
        status: TransactionStatus.SUCCESS,
        gatewayResponse: { code: 100 },
      }),
    );

    expect(order.updatePaymentStatus).toHaveBeenCalledWith('completed');
    expect(orderRepo.update).toHaveBeenCalledWith(order);

    expect(eventPublisher.publish).toHaveBeenCalledWith({
      eventId: expect.any(String),
      name: 'payment.succeeded',
      version: 1,
      occurredAt: expect.any(String),
      payload: {
        paymentId: 'pay-1',
        orderId: 'order-1',
        userId: 'user-1',
        amount: 1000,
        transactionId: 'txn-1',
      },
    });
  });
});
