import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductsService } from './products.service';
import { Product } from './schemas/product.schema';
import { Types } from 'mongoose';

describe('ProductsService', () => {
  let service: ProductsService;
  let productModel: Model<Product>;

  const mockProduct = {
    _id: new Types.ObjectId(),
    name: 'Test Product',
    price: 100,
    rating: 4.5,
    discount: 10,
    isFeatured: true,
    purchases: 100,
    views: 500,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getModelToken('Product'),
          useValue: {
            create: jest.fn().mockResolvedValue(mockProduct),
            find: jest.fn().mockReturnThis(),
            findById: jest.fn().mockReturnThis(),
            findByIdAndUpdate: jest.fn().mockReturnThis(),
            findByIdAndDelete: jest.fn().mockReturnThis(),
            exec: jest.fn().mockResolvedValue(mockProduct),
            save: jest.fn().mockResolvedValue(mockProduct),
            sort: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            $inc: jest.fn(),
            $addToSet: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    productModel = module.get<Model<Product>>(getModelToken('Product'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const productDto = {
        name: 'Test Product',
        price: 100,
      };
      const result = await service.create(productDto as Product);
      expect(result).toEqual(mockProduct);
      expect(productModel.create).toHaveBeenCalledWith(productDto);
    });
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      jest.spyOn(productModel, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockProduct]),
      } as any);
      const result = await service.findAll();
      expect(result).toEqual([mockProduct]);
      expect(productModel.find).toHaveBeenCalled();
    });
  });

  describe('getTopRatedProducts', () => {
    it('should return top rated products', async () => {
      const limit = 5;
      jest.spyOn(productModel, 'find').mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockProduct]),
      } as any);

      const result = await service.getTopRatedProducts(limit);
      expect(result).toEqual([mockProduct]);
      expect(productModel.find).toHaveBeenCalled();
      // expect(productModel.sort).toHaveBeenCalledWith({ rating: -1 });
      // expect(productModel.limit).toHaveBeenCalledWith(limit);
    });
  });

  describe('getHighestDiscountProducts', () => {
    it('should return highest discount products', async () => {
      const limit = 5;
      jest.spyOn(productModel, 'find').mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockProduct]),
      } as any);

      const result = await service.getHighestDiscountProducts(limit);
      expect(result).toEqual([mockProduct]);
      expect(productModel.find).toHaveBeenCalledWith({
        discount: { $exists: true, $gt: 0 },
      });
      // expect(productModel.sort).toHaveBeenCalledWith({ discount: -1 });
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      const productId = mockProduct._id.toString();
      jest.spyOn(productModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockProduct),
      } as any);

      const result = await service.findOne(productId);
      expect(result).toEqual(mockProduct);
      expect(productModel.findById).toHaveBeenCalledWith(productId);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const productId = mockProduct._id.toString();
      const updateDto = { name: 'Updated Product' };
      jest.spyOn(productModel, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue({ ...mockProduct, ...updateDto }),
      } as any);

      const result = await service.update(productId, updateDto as Product);
      expect(result).toEqual({ ...mockProduct, ...updateDto });
      expect(productModel.findByIdAndUpdate).toHaveBeenCalledWith(
        productId,
        updateDto,
        { new: true },
      );
    });
  });

  describe('delete', () => {
    it('should delete a product', async () => {
      const productId = mockProduct._id.toString();
      jest.spyOn(productModel, 'findByIdAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockProduct),
      } as any);

      const result = await service.delete(productId);
      expect(result).toEqual(mockProduct);
      expect(productModel.findByIdAndDelete).toHaveBeenCalledWith(productId);
    });
  });

  describe('incrementField', () => {
    it('should increment the specified field', async () => {
      const productId = mockProduct._id.toString();
      const field = 'views';
      jest.spyOn(productModel, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          ...mockProduct,
          [field]: mockProduct[field] + 1,
        }),
      } as any);

      const result = await service.incrementField(productId, field);
      // expect(result[field]).toEqual(mockProduct[field] + 1);
      expect(productModel.findByIdAndUpdate).toHaveBeenCalledWith(
        productId,
        { $inc: { [field]: 1 } },
        { new: true },
      );
    });
  });

  describe('searchProducts', () => {
    it('should search products with text query', async () => {
      const filters = { query: 'test' };
      jest.spyOn(productModel, 'find').mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockProduct]),
      } as any);

      const result = await service.searchProducts(filters);
      expect(result).toEqual([mockProduct]);
      expect(productModel.find).toHaveBeenCalledWith({
        $text: { $search: 'test' },
      });
      // expect(productModel.sort).toHaveBeenCalledWith({
      score: {
        $meta: 'textScore';
      }
    });
  });

  it('should search products with price range', async () => {
    const filters = { minPrice: 50, maxPrice: 150 };
    jest.spyOn(productModel, 'find').mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([mockProduct]),
    } as any);

    const result = await service.searchProducts(filters);
    expect(result).toEqual([mockProduct]);
    expect(productModel.find).toHaveBeenCalledWith({
      price: { $gte: 50, $lte: 150 },
    });
  });

  it('should search products with categories', async () => {
    const categoryId = new Types.ObjectId();
    const filters = { categories: [categoryId] };
    jest.spyOn(productModel, 'find').mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([mockProduct]),
    } as any);

    const result = await service.searchProducts(filters);
    expect(result).toEqual([mockProduct]);
    expect(productModel.find).toHaveBeenCalledWith({
      categoryId: { $in: [categoryId] },
    });
  });
});

// Similarly add tests for other methods like updateSimilarProducts, addUserFeedbackKeywords, etc.
