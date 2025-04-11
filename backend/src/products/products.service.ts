import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schemas/product.schema';
import * as mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import { Types } from 'mongoose';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
  ) {}

  async create(product: Product): Promise<Product> {
    const newProduct = new this.productModel(product);
    return newProduct.save();
  }

  async findAll(): Promise<Product[]> {
    return this.productModel.find().exec();
  }
  async getTopRatedProducts(limit: number = 6): Promise<Product[]> {
    return this.productModel
      .find()
      .sort({ rating: -1 }) // Sort by rating descending
      .limit(limit)
      .exec();
  }
  async getHighestDiscountProducts(limit: number = 6): Promise<Product[]> {
    return this.productModel
      .find({ discount: { $exists: true, $gt: 0 } })
      .sort({ discount: -1 })
      .limit(limit)
      .exec();
  }

  async findOne(id: string): Promise<Product | null> {
    return this.productModel.findById(id).exec();
  }

  async update(id: string, product: Product): Promise<Product | null> {
    return this.productModel
      .findByIdAndUpdate(id, product, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Product | null> {
    return this.productModel.findByIdAndDelete(id).exec();
  }
  async incrementField(id: string, field: string): Promise<Product | null> {
    return this.productModel.findByIdAndUpdate(
      id,
      { $inc: { [field]: 1 } },
      { new: true },
    );
  }

  async updateSimilarProducts(
    id: string,
    similarProducts: string[],
  ): Promise<Product | null> {
    return this.productModel.findByIdAndUpdate(
      id,
      { similarProducts },
      { new: true },
    );
  }

  async addUserFeedbackKeywords(
    id: string,
    keywords: string[],
  ): Promise<Product | null> {
    return this.productModel.findByIdAndUpdate(
      id,
      { $addToSet: { userFeedbackKeywords: { $each: keywords } } },
      { new: true },
    );
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return this.productModel
      .find({ isFeatured: true })
      .sort({ lastUpdated: -1 })
      .exec();
  }

  async getPopularProducts(limit: number = 10): Promise<Product[]> {
    return this.productModel
      .find()
      .sort({ purchases: -1, views: -1 })
      .limit(limit)
      .exec();
  }

  async searchProducts(filters: {
    query?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    categories?: Types.ObjectId[];
    sortBy?: string;
  }): Promise<Product[]> {
    try {
      const { query, minPrice, maxPrice, minRating, categories, sortBy } =
        filters;

      const queryConditions: any = {};

      if (query) {
        queryConditions.$text = { $search: query };
      }
      if (minPrice !== undefined || maxPrice !== undefined) {
        queryConditions.price = {};
        if (minPrice !== undefined) queryConditions.price.$gte = minPrice;
        if (maxPrice !== undefined) queryConditions.price.$lte = maxPrice;
      }

      if (minRating) {
        queryConditions.rating = { $gte: minRating };
      }

      if (categories && categories.length > 0) {
        queryConditions.categoryId = { $in: categories };
      }

      let sortOptions: any = { createdAt: -1 };
      if (sortBy) {
        switch (sortBy) {
          case 'price-asc':
            sortOptions = { price: 1 };
            break;
          case 'price-desc':
            sortOptions = { price: -1 };
            break;
          case 'rating':
            sortOptions = { rating: -1 };
            break;
          case 'popularity':
            sortOptions = { views: -1 };
            break;
        }
      } else if (query) {
        sortOptions = { score: { $meta: 'textScore' } };
      }

      return this.productModel
        .find(queryConditions)
        .sort(sortOptions)
        .select('-__v')
        .exec();
    } catch (error) {
      throw new Error(`Search error: ${error.message}`);
    }
  }
}
