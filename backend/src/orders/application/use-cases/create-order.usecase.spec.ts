import { CreateOrderUseCase } from "./create-order.usecase";
import { IOrderRepository } from '../../domain/order.repository.port';
import { EventPublisher } from '../../../shared/messaging/application/ports/event-publisher.port';

describe('CreateOrderUseCase', () => {
  let usecase: CreateOrderUseCase;
  let repository: jest.Mocked<IOrderRepository>;
  let eventPublisher: jest.Mocked<EventPublisher>;

  const dto = {
    userId: "1",
    products: [
      {
        productId: "1",
        quantity: 1,
        price: 1000,
        name: 'x',
      },
    ],
    totalPrice: 1000,
    shippingAddress: {
      firstName: "x",
      streetAddress: "x",
      city: "x",
    },
    contactInfo: {
      phone: '0000',
      email: 's@s',
    },
    paymentMethod: 'x',
  };

  beforeEach(() => {
    repository = {
      create: jest.fn(),
    } as any;

    eventPublisher = {
      publish: jest.fn(),
    } as any;

    usecase = new CreateOrderUseCase(
      repository,
      eventPublisher,
    );
  });

  it('should successfully create an order', async () => {
    const created = {
      id: 'order-1',
      userId: dto.userId,
      products: dto.products,
      totalPrice: dto.totalPrice,
      shippingAddress: dto.shippingAddress,
      contactInfo: dto.contactInfo,
      paymentMethod: dto.paymentMethod,
    };

    repository.create.mockResolvedValue(created as any);

    await expect(
      usecase.execute(dto),
    ).resolves.toEqual(created);

    expect(eventPublisher.publish).toHaveBeenCalled();
  });

  it('should create the order with correct data', async () => {
    const created = {
      id: 'order-1',
      userId: dto.userId,
      products: dto.products,
      totalPrice: dto.totalPrice,
      shippingAddress: dto.shippingAddress,
      contactInfo: dto.contactInfo,
      paymentMethod: dto.paymentMethod,
    };

    repository.create.mockResolvedValue(created as any);

    await usecase.execute(dto);

    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: dto.userId,
        products: dto.products,
        totalPrice: dto.totalPrice,
        shippingAddress: dto.shippingAddress,
        contactInfo: dto.contactInfo,
        paymentMethod: dto.paymentMethod,
      }),
    );
  });

  it('should publish order.created event with correct payload', async () => {
    const created = {
      id: 'order-1',
      userId: dto.userId,
      products: dto.products,
      totalPrice: dto.totalPrice,
    };

    repository.create.mockResolvedValue(created as any);

    await usecase.execute(dto);

    expect(eventPublisher.publish).toHaveBeenCalledWith({
      eventId: expect.any(String),
      name: 'order.created',
      version: 1,
      occurredAt: expect.any(String),
      payload: {
        orderId: 'order-1',
        userId: '1',
        totalPrice: 1000,
      },
    });
  });

  it('should not publish event when order creation fails', async () => {
    const error = new Error('Database error');

    repository.create.mockRejectedValue(error);

    await expect(
      usecase.execute(dto),
    ).rejects.toThrow('Database error');

    expect(eventPublisher.publish).not.toHaveBeenCalled();
  });
});