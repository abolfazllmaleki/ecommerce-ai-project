import { AddToCartUseCase } from './add-to-cart.usecase';
import { ICartRepository } from '../../domain/cart.repository.port';
import { IProductRepository } from '../../../products/domain/product.repository.port';
import { NotFoundException } from '@nestjs/common';

describe('AddToCartUseCase', () => {
  let usecase: AddToCartUseCase;
  let cartRepo: jest.Mocked<ICartRepository>;
  let productRepo: jest.Mocked<IProductRepository>;

  beforeEach(() => {
    cartRepo = {
      findByUserId: jest.fn(),
      save: jest.fn(),
    } as any;

    productRepo = {
      findById: jest.fn(),
    } as any;

    usecase = new AddToCartUseCase(
      cartRepo,
      productRepo,
    );
  });

  it('should add product to existing cart', async () => {
    const product = {
      id: 'product-1',
      price: 1000,
    };

    const cart = {
      addItem: jest.fn(),
    };

    const savedCart = {
      userId: 'user-1',
      items: [
        {
          productId: 'product-1',
          price: 1000,
        },
      ],
      total: 1000,
    };

    productRepo.findById.mockResolvedValue(product as any);
    cartRepo.findByUserId.mockResolvedValue(cart as any);
    cartRepo.save.mockResolvedValue(savedCart as any);

    await expect(
      usecase.execute('user-1', 'product-1'),
    ).resolves.toEqual(savedCart);

    expect(productRepo.findById).toHaveBeenCalledWith('product-1');

    expect(cart.addItem).toHaveBeenCalledWith(
      'product-1',
      1000,
    );

    expect(cartRepo.save).toHaveBeenCalledWith(cart);
  });

  it('should create a new cart when user has no cart', async () => {
    const product = {
      id: 'product-1',
      price: 1000,
    };

    const savedCart = {
      userId: 'user-1',
      items: [],
      total: 0,
    };

    productRepo.findById.mockResolvedValue(product as any);
    cartRepo.findByUserId.mockResolvedValue(null);
    cartRepo.save.mockResolvedValue(savedCart as any);

    await usecase.execute('user-1', 'product-1');

    expect(cartRepo.save).toHaveBeenCalled();

    const cart = cartRepo.save.mock.calls[0][0];

    expect(cart).toEqual(
      expect.objectContaining({
        userId: 'user-1',
      }),
    );
  });

  it('should throw NotFoundException when product does not exist', async () => {
    productRepo.findById.mockResolvedValue(null);

    await expect(
      usecase.execute('user-1', 'product-1'),
    ).rejects.toThrow(
      new NotFoundException('Product not found'),
    );

    expect(cartRepo.findByUserId).not.toHaveBeenCalled();
    expect(cartRepo.save).not.toHaveBeenCalled();
  });
});