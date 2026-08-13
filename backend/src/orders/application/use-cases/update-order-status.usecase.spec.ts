import { UpdateOrderStatusUseCase } from './update-order-status.usecase';
import { IOrderRepository } from '../../domain/order.repository.port';
import { NotFoundException } from '@nestjs/common';

describe('UpdateOrderStatusUseCase', () => {
  let usecase: UpdateOrderStatusUseCase;
  let repository: jest.Mocked<IOrderRepository>;

  beforeEach(() => {
    repository = {
      findById: jest.fn(),
      update: jest.fn(),
    } as any;

    usecase = new UpdateOrderStatusUseCase(repository);
  });

  it('should successfully update order status', async () => {
    const order = {
      id: 'order-1',
      updateStatus: jest.fn(),
    };

    const savedOrder = {
      id: 'order-1',
      status: 'shipped',
    };

    repository.findById.mockResolvedValue(order as any);
    repository.update.mockResolvedValue(savedOrder as any);

    await expect(
      usecase.execute('order-1', 'shipped'),
    ).resolves.toEqual(savedOrder);

    expect(repository.findById).toHaveBeenCalledWith('order-1');

    expect(order.updateStatus).toHaveBeenCalledWith('shipped');

    expect(repository.update).toHaveBeenCalledWith(order);
  });

  it('should throw NotFoundException when order does not exist', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(
      usecase.execute('order-1', 'shipped'),
    ).rejects.toThrow(
      new NotFoundException('Order not found'),
    );

    expect(repository.update).not.toHaveBeenCalled();
  });

  it('should throw NotFoundException when update fails', async () => {
    const order = {
      id: 'order-1',
      updateStatus: jest.fn(),
    };

    repository.findById.mockResolvedValue(order as any);
    repository.update.mockResolvedValue(null);

    await expect(
      usecase.execute('order-1', 'shipped'),
    ).rejects.toThrow(
      new NotFoundException('Order not found'),
    );

    expect(order.updateStatus).toHaveBeenCalledWith('shipped');

    expect(repository.update).toHaveBeenCalledWith(order);
  });
});