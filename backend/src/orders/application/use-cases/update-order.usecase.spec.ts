import { UpdateOrderUseCase } from './update-order.usecase';
import { IOrderRepository } from '../../domain/order.repository.port';
import { NotFoundException } from '@nestjs/common';

describe('UpdateOrderUseCase', () => {
  let usecase: UpdateOrderUseCase;
  let repository: jest.Mocked<IOrderRepository>;

  beforeEach(() => {
    repository = {
      findById: jest.fn(),
      update: jest.fn(),
    } as any;

    usecase = new UpdateOrderUseCase(repository);
  });

  it('should successfully update an order', async () => {
    const current = {
      id: 'order-1',
      userId: 'user-1',
      products: [
        {
          productId: 'product-1',
          quantity: 1,
          price: 1000,
          name: 'Product 1',
        },
      ],
      totalPrice: 1000,
      status: 'pending',
      shippingAddress: {
        city: 'Baku',
      },
      contactInfo: {
        phone: '0000',
      },
      paymentMethod: 'card',
      paymentStatus: 'pending',
      orderDate: new Date(),
      shippedDate: undefined,
      deliveredDate: undefined,
    };

    const saved = {
      ...current,
      totalPrice: 2000,
      status: 'confirmed',
    };

    repository.findById.mockResolvedValue(current as any);
    repository.update.mockResolvedValue(saved as any);

    await expect(
      usecase.execute('order-1', {
        totalPrice: 2000,
        status: 'confirmed',
      }),
    ).resolves.toEqual(saved);

    expect(repository.findById).toHaveBeenCalledWith('order-1');

    expect(repository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'order-1',
        totalPrice: 2000,
        status: 'confirmed',
      }),
    );
  });

  it('should throw NotFoundException when order does not exist', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(
      usecase.execute('order-1', {
        totalPrice: 2000,
      }),
    ).rejects.toThrow(
      new NotFoundException('Order not found'),
    );

    expect(repository.update).not.toHaveBeenCalled();
  });

  it('should throw NotFoundException when update fails', async () => {
    const current = {
      id: 'order-1',
      userId: 'user-1',
      products: [
        {
          productId: 'product-1',
          quantity: 1,
          price: 1000,
          name: 'Product 1',
        },
      ],
      totalPrice: 1000,
      status: 'pending',
      shippingAddress: {},
      contactInfo: {},
      paymentMethod: 'card',
      paymentStatus: 'pending',
      orderDate: new Date(),
      shippedDate: undefined,
      deliveredDate: undefined,
    };

    repository.findById.mockResolvedValue(current as any);
    repository.update.mockResolvedValue(null);

    await expect(
      usecase.execute('order-1', {
        totalPrice: 2000,
      }),
    ).rejects.toThrow(
      new NotFoundException('Order not found'),
    );

    expect(repository.update).toHaveBeenCalled();
  });

  it('should keep existing values when they are not included in patch', async () => {
    const current = {
      id: 'order-1',
      userId: 'user-1',
      products: [
        {
          productId: 'product-1',
          quantity: 1,
          price: 1000,
          name: 'Product 1',
        },
      ],
      totalPrice: 1000,
      status: 'pending',
      shippingAddress: {
        city: 'Baku',
      },
      contactInfo: {
        phone: '0000',
      },
      paymentMethod: 'card',
      paymentStatus: 'pending',
      orderDate: new Date(),
      shippedDate: undefined,
      deliveredDate: undefined,
    };

    repository.findById.mockResolvedValue(current as any);
    repository.update.mockResolvedValue(current as any);

    await usecase.execute('order-1', {
      totalPrice: 2000,
    });

    expect(repository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'order-1',
        userId: 'user-1',
        products: current.products,
        totalPrice: 2000,
        status: 'pending',
        shippingAddress: current.shippingAddress,
        contactInfo: current.contactInfo,
        paymentMethod: 'card',
        paymentStatus: 'pending',
      }),
    );
  });
});