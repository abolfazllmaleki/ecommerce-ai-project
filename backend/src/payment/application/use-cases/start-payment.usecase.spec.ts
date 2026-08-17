import { StartPaymentUseCase } from './start-payment.usecase';
import { IPaymentRepository } from '../../domain/payment.repository.port';
import { PaymentGatewayPort } from '../../domain/payment-gateway.port';
import { IOrderRepository } from '../../../orders/domain/order.repository.port';
import { CreateTransactionUseCase } from '../../../transaction/application/use-cases/create-transaction.usecase';
import {
  TransactionStatus,
  TransactionType,
} from '../../../transaction/domain/transaction.entity';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';

describe('StartPaymentUseCase', () => {
  let usecase: StartPaymentUseCase;
  let paymentRepo: jest.Mocked<IPaymentRepository>;
  let orderRepo: jest.Mocked<IOrderRepository>;
  let gateway: jest.Mocked<PaymentGatewayPort>;
  let createTransaction: jest.Mocked<CreateTransactionUseCase>;

  const buildOrder = () => ({
    id: 'order-1',
    userId: 'user-1',
    totalPrice: 1000,
    paymentStatus: 'unpaid',
    updatePaymentStatus: jest.fn(),
  });

  beforeEach(() => {
    paymentRepo = {
      findActiveByOrderId: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    } as any;

    orderRepo = {
      findById: jest.fn(),
      update: jest.fn(),
    } as any;

    gateway = {
      createPayment: jest.fn(),
    } as any;

    createTransaction = {
      execute: jest.fn(),
    } as any;

    usecase = new StartPaymentUseCase(
      paymentRepo,
      orderRepo,
      gateway,
      createTransaction,
    );
  });

  it('should start a new payment and return the gateway payment url', async () => {
    const order = buildOrder();

    const createdPayment = {
      id: 'pay-1',
      orderId: 'order-1',
      amount: 1000,
      markInitiated: jest.fn(),
      markFailed: jest.fn(),
    };

    const updatedPayment = {
      id: 'pay-1',
      orderId: 'order-1',
      authority: 'auth-1',
      paymentUrl: 'https://pay/auth-1',
      amount: 1000,
    };

    orderRepo.findById.mockResolvedValue(order as any);
    paymentRepo.findActiveByOrderId.mockResolvedValue(null);
    paymentRepo.create.mockResolvedValue(createdPayment as any);
    gateway.createPayment.mockResolvedValue({
      authority: 'auth-1',
      paymentUrl: 'https://pay/auth-1',
      rawResponse: { ok: true },
    });
    paymentRepo.update.mockResolvedValue(updatedPayment as any);
    orderRepo.update.mockResolvedValue(order as any);

    await expect(usecase.execute({ orderId: 'order-1' })).resolves.toEqual({
      paymentId: 'pay-1',
      orderId: 'order-1',
      authority: 'auth-1',
      paymentUrl: 'https://pay/auth-1',
      reused: false,
    });

    expect(createdPayment.markInitiated).toHaveBeenCalledWith(
      'auth-1',
      'https://pay/auth-1',
    );

    expect(createTransaction.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        paymentId: 'pay-1',
        orderId: 'order-1',
        amount: 1000,
        type: TransactionType.REQUEST,
        status: TransactionStatus.SUCCESS,
        gatewayResponse: { ok: true },
      }),
    );

    expect(order.updatePaymentStatus).toHaveBeenCalledWith('pending');
    expect(orderRepo.update).toHaveBeenCalledWith(order);
  });

  it('should throw BadRequestException when the order does not exist', async () => {
    orderRepo.findById.mockResolvedValue(null);

    await expect(usecase.execute({ orderId: 'order-1' })).rejects.toThrow(
      new BadRequestException('Order not found'),
    );

    expect(paymentRepo.create).not.toHaveBeenCalled();
  });

  it('should throw ForbiddenException when the order belongs to another user', async () => {
    const order = buildOrder();

    orderRepo.findById.mockResolvedValue(order as any);

    await expect(
      usecase.execute({ orderId: 'order-1', userId: 'someone-else' }),
    ).rejects.toThrow(new ForbiddenException('You cannot pay this order'));

    expect(paymentRepo.create).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when the order is already paid', async () => {
    const order = { ...buildOrder(), paymentStatus: 'paid' };

    orderRepo.findById.mockResolvedValue(order as any);

    await expect(usecase.execute({ orderId: 'order-1' })).rejects.toThrow(
      new BadRequestException('Order already paid'),
    );

    expect(paymentRepo.create).not.toHaveBeenCalled();
  });

  it('should reuse an active payment that still has a payment url', async () => {
    const order = buildOrder();

    const activePayment = {
      id: 'pay-active',
      orderId: 'order-1',
      authority: 'auth-active',
      paymentUrl: 'https://pay/auth-active',
      isExpired: jest.fn().mockReturnValue(false),
    };

    orderRepo.findById.mockResolvedValue(order as any);
    paymentRepo.findActiveByOrderId.mockResolvedValue(activePayment as any);

    await expect(usecase.execute({ orderId: 'order-1' })).resolves.toEqual({
      paymentId: 'pay-active',
      orderId: 'order-1',
      authority: 'auth-active',
      paymentUrl: 'https://pay/auth-active',
      reused: true,
    });

    expect(paymentRepo.create).not.toHaveBeenCalled();
  });

  it('should throw ConflictException when an active payment has no payment url yet', async () => {
    const order = buildOrder();

    const activePayment = {
      id: 'pay-active',
      orderId: 'order-1',
      paymentUrl: undefined,
      isExpired: jest.fn().mockReturnValue(false),
    };

    orderRepo.findById.mockResolvedValue(order as any);
    paymentRepo.findActiveByOrderId.mockResolvedValue(activePayment as any);

    await expect(usecase.execute({ orderId: 'order-1' })).rejects.toThrow(
      new ConflictException('Payment is already being started'),
    );

    expect(paymentRepo.create).not.toHaveBeenCalled();
  });

  it('should mark an expired active payment as expired and start a new payment', async () => {
    const order = buildOrder();

    const activePayment = {
      id: 'pay-expired',
      orderId: 'order-1',
      isExpired: jest.fn().mockReturnValue(true),
      markExpired: jest.fn(),
    };

    const createdPayment = {
      id: 'pay-1',
      orderId: 'order-1',
      amount: 1000,
      markInitiated: jest.fn(),
      markFailed: jest.fn(),
    };

    const updatedPayment = {
      id: 'pay-1',
      orderId: 'order-1',
      authority: 'auth-1',
      paymentUrl: 'https://pay/auth-1',
      amount: 1000,
    };

    orderRepo.findById.mockResolvedValue(order as any);
    paymentRepo.findActiveByOrderId.mockResolvedValue(activePayment as any);
    paymentRepo.create.mockResolvedValue(createdPayment as any);
    gateway.createPayment.mockResolvedValue({
      authority: 'auth-1',
      paymentUrl: 'https://pay/auth-1',
      rawResponse: { ok: true },
    });
    paymentRepo.update.mockResolvedValue(updatedPayment as any);
    orderRepo.update.mockResolvedValue(order as any);

    await expect(usecase.execute({ orderId: 'order-1' })).resolves.toEqual({
      paymentId: 'pay-1',
      orderId: 'order-1',
      authority: 'auth-1',
      paymentUrl: 'https://pay/auth-1',
      reused: false,
    });

    expect(activePayment.markExpired).toHaveBeenCalled();
    expect(paymentRepo.update).toHaveBeenCalledWith(activePayment);
    expect(paymentRepo.create).toHaveBeenCalled();
  });

  it('should reuse an existing payment on a duplicate key error during create', async () => {
    const order = buildOrder();

    const existingPayment = {
      id: 'pay-existing',
      orderId: 'order-1',
      authority: 'auth-existing',
      paymentUrl: 'https://pay/auth-existing',
    };

    const duplicateError: any = new Error('E11000 duplicate key');
    duplicateError.code = 11000;

    orderRepo.findById.mockResolvedValue(order as any);
    paymentRepo.findActiveByOrderId
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(existingPayment as any);
    paymentRepo.create.mockRejectedValue(duplicateError);

    await expect(usecase.execute({ orderId: 'order-1' })).resolves.toEqual({
      paymentId: 'pay-existing',
      orderId: 'order-1',
      authority: 'auth-existing',
      paymentUrl: 'https://pay/auth-existing',
      reused: true,
    });

    expect(gateway.createPayment).not.toHaveBeenCalled();
  });

  it('should throw ConflictException on a duplicate key error without an existing payment url', async () => {
    const order = buildOrder();

    const duplicateError: any = new Error('E11000 duplicate key');
    duplicateError.code = 11000;

    orderRepo.findById.mockResolvedValue(order as any);
    paymentRepo.findActiveByOrderId
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);
    paymentRepo.create.mockRejectedValue(duplicateError);

    await expect(usecase.execute({ orderId: 'order-1' })).rejects.toThrow(
      new ConflictException('Payment is already being started'),
    );
  });

  it('should rethrow unexpected errors during create', async () => {
    const order = buildOrder();

    orderRepo.findById.mockResolvedValue(order as any);
    paymentRepo.findActiveByOrderId.mockResolvedValue(null);
    paymentRepo.create.mockRejectedValue(new Error('Database error'));

    await expect(usecase.execute({ orderId: 'order-1' })).rejects.toThrow(
      'Database error',
    );
  });

  it('should mark the payment failed and throw when the gateway fails', async () => {
    const order = buildOrder();

    const createdPayment = {
      id: 'pay-1',
      orderId: 'order-1',
      amount: 1000,
      markInitiated: jest.fn(),
      markFailed: jest.fn(),
    };

    orderRepo.findById.mockResolvedValue(order as any);
    paymentRepo.findActiveByOrderId.mockResolvedValue(null);
    paymentRepo.create.mockResolvedValue(createdPayment as any);
    gateway.createPayment.mockRejectedValue(new Error('gateway down'));
    paymentRepo.update.mockResolvedValue(createdPayment as any);

    await expect(usecase.execute({ orderId: 'order-1' })).rejects.toThrow(
      new InternalServerErrorException('Payment could not be started'),
    );

    expect(createdPayment.markFailed).toHaveBeenCalled();

    expect(createTransaction.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        type: TransactionType.REQUEST,
        status: TransactionStatus.FAILED,
      }),
    );
  });
});
