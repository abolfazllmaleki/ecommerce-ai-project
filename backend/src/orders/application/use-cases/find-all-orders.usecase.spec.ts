import { FindAllOrdersUseCase } from './find-all-orders.usecase';
import { IOrderRepository } from '../../domain/order.repository.port';

describe('FindAllOrdersUseCase', () => {
  let usecase: FindAllOrdersUseCase;
  let repository: jest.Mocked<IOrderRepository>;

  beforeEach(() => {
    repository = {
      findAll: jest.fn(),
    } as any;

    usecase = new FindAllOrdersUseCase(repository);
  });

  it('should return all orders', async () => {
    const orders = [
      { id: 'order-1' },
      { id: 'order-2' },
    ];

    repository.findAll.mockResolvedValue(orders as any);

    await expect(usecase.execute()).resolves.toEqual(orders);

    expect(repository.findAll).toHaveBeenCalledWith();
  });

  it('should return an empty array when there are no orders', async () => {
    repository.findAll.mockResolvedValue([]);

    await expect(usecase.execute()).resolves.toEqual([]);

    expect(repository.findAll).toHaveBeenCalled();
  });
});
