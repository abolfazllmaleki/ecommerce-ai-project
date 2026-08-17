import { FindOrdersByUserUseCase } from './find-orders-by-user.usecase';
import { IOrderRepository } from '../../domain/order.repository.port';

describe('FindOrdersByUserUseCase', () => {
  let usecase: FindOrdersByUserUseCase;
  let repository: jest.Mocked<IOrderRepository>;

  beforeEach(() => {
    repository = {
      findByUserId: jest.fn(),
    } as any;

    usecase = new FindOrdersByUserUseCase(repository);
  });

  it('should return the orders for the given user', async () => {
    const orders = [
      { id: 'order-1', userId: 'user-1' },
      { id: 'order-2', userId: 'user-1' },
    ];

    repository.findByUserId.mockResolvedValue(orders as any);

    await expect(usecase.execute('user-1')).resolves.toEqual(orders);

    expect(repository.findByUserId).toHaveBeenCalledWith('user-1');
  });

  it('should return an empty array when the user has no orders', async () => {
    repository.findByUserId.mockResolvedValue([]);

    await expect(usecase.execute('user-1')).resolves.toEqual([]);

    expect(repository.findByUserId).toHaveBeenCalledWith('user-1');
  });
});
