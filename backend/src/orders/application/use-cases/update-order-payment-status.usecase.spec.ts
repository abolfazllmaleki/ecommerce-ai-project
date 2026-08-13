import { UpdateOrderPaymentStatusUseCase } from './update-order-payment-status.usecase';
import { IOrderRepository } from '../../domain/order.repository.port';
import { NotFoundException } from '@nestjs/common';

describe('UpdateOrderPaymentStatusUseCase', () => {
  let usecase: UpdateOrderPaymentStatusUseCase;
  let repository: jest.Mocked<IOrderRepository>;

  beforeEach(() => {
    repository = {
      findById: jest.fn(),
      update: jest.fn(),
    } as any;

    usecase = new UpdateOrderPaymentStatusUseCase(repository);
  });

  it('should successfully update payment status', async () => {
    const order = {
      updatePaymentStatus: jest.fn(),
    };

    const savedOrder = {
      id: 'order-1',
      paymentStatus: 'paid',
    };

    repository.findById.mockResolvedValue(order as any);
    repository.update.mockResolvedValue(savedOrder as any);

    await expect(
      usecase.execute('order-1', 'paid'),
    ).resolves.toEqual(savedOrder);

    expect(order.updatePaymentStatus).toHaveBeenCalledWith('paid');

    expect(repository.update).toHaveBeenCalledWith(order);
  });

  it('should throw NotFoundException when order does not exist', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(
      usecase.execute('order-1', 'paid'),
    ).rejects.toThrow(
      new NotFoundException('Order not found'),
    );

    expect(repository.update).not.toHaveBeenCalled();
  });

  it('should throw NotFoundException when update fails', async () => {
    const order = {
      updatePaymentStatus: jest.fn(),
    };

    repository.findById.mockResolvedValue(order as any);
    repository.update.mockResolvedValue(null);

    await expect(
      usecase.execute('order-1', 'paid'),
    ).rejects.toThrow(
      new NotFoundException('Order not found'),
    );

    expect(order.updatePaymentStatus).toHaveBeenCalledWith('paid');
    expect(repository.update).toHaveBeenCalledWith(order);
  });
});