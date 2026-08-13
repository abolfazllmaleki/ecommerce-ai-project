import { beforeEach, describe, expect, it } from '@jest/globals';
import { CreateProductUseCase } from './create-product.use-case';
import { IProductRepository } from 'src/products/domain/product.repository.port';

describe('CreateProductUseCase', () => {
  let repo: jest.Mocked<IProductRepository>;
  let useCase: CreateProductUseCase;

  beforeEach(() => {
    repo = {
      create: jest.fn(),
    } as any;

    useCase = new CreateProductUseCase(repo);
  });

  it('should create product', async () => {
    const dto = {
      name: 'Test Product',
      price: 5000,
      categoryId: '1',
      stock: 1,
    };

    const newProduct = {
      id: 'product-1',
      name: 'Test Product',
      price: 5000,
      categoryId: '1',
      stock: 1,
      tags: [],
      images: [],
      colors: [],
      sizes: [],
      discount: 0,
      isFeatured: false,
    };

    repo.create.mockResolvedValue(newProduct as any);

    const result = await useCase.execute(dto as any);

    expect(result).toEqual(newProduct);

    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Test Product',
        price: 5000,
        categoryId: '1',
        stock: 1,
        tags: [],
        images: [],
        colors: [],
        sizes: [],
        discount: 0,
        isFeatured: false,
      }),
    );
  });
});