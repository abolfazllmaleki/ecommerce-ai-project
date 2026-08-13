import { DeleteOrderUseCase } from './delete-order.usecase';
import { IOrderRepository } from '../../domain/order.repository.port';
import { NotFoundException } from '@nestjs/common';

describe('DeleteOrderUseCase', () => {
  let usecase: DeleteOrderUseCase;
  let repository: jest.Mocked<IOrderRepository>;

  beforeEach(() => {
    repository = {
      delete: jest.fn(),
    } as any;

    usecase = new DeleteOrderUseCase(repository);
  });

  it('should successfully delete an order', async () => {
    repository.delete.mockResolvedValue(true);

    await expect(
      usecase.execute('order-1'),
    ).resolves.toBeUndefined();

    expect(repository.delete).toHaveBeenCalledWith('order-1');
  });

  it('should throw NotFoundException when order does not exist', async () => {
    repository.delete.mockResolvedValue(false);

    await expect(
      usecase.execute('order-1'),
    ).rejects.toThrow(
      new NotFoundException('Order not found'),
    );
  });

  it('should call repository.delete with the correct id', async () => {
    repository.delete.mockResolvedValue(true);

    await usecase.execute('order-123');

    expect(repository.delete).toHaveBeenCalledWith('order-123');
    expect(repository.delete).toHaveBeenCalledTimes(1);
  });
});