import { FindOrderByIdUseCase } from './find-order-by-id.usecase';
import { IOrderRepository } from '../../domain/order.repository.port';
import { NotFoundException } from '@nestjs/common';

describe('FindOrderByIdUseCase', () => {
  let usecase: FindOrderByIdUseCase;
  let repository: jest.Mocked<IOrderRepository>;

  beforeEach(() => {
    repository = {
      findById: jest.fn(),
    } as any;

    usecase = new FindOrderByIdUseCase(repository);
  });

  it('should return the order when it exists', async () => {
    const order = {
      id: 'order-1',
      status: 'pending',
    };

    repository.findById.mockResolvedValue(order as any);

    await expect(usecase.execute('order-1')).resolves.toEqual(order);

    expect(repository.findById).toHaveBeenCalledWith('order-1');
  });

  it('should throw NotFoundException when order does not exist', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(usecase.execute('order-1')).rejects.toThrow(
      new NotFoundException('Order not found'),
    );

    expect(repository.findById).toHaveBeenCalledWith('order-1');
  });
});
