import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import {
  IProductRepository,
  PaginatedProducts,
  SearchCriteria,
} from '../domain/product.repository.port';
import { Product as ProductEntity } from '../domain/product.entity';
import { ProductDocument } from '../schemas/product.schema';
import { ProductMapper } from './product.mapper';

type CounterField = 'views' | 'purchases' | 'wishlistAdds';

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(
    @InjectModel('Product')
    private readonly model: Model<ProductDocument>,



  ) {}

  async create(product: ProductEntity): Promise<ProductEntity> {
    const data = ProductMapper.toPersistenceOnCreate(product);
    const created = new this.model(data);
    const saved = await created.save();
    return ProductMapper.toDomain(saved);
  }



  async findById(id: string): Promise<ProductEntity | null> {
    if (!Types.ObjectId.isValid(id)) return null;

    const doc = await this.model.findById(id).exec();
    return doc ? ProductMapper.toDomain(doc) : null;
  }

  async findAll(): Promise<ProductEntity[]> {
    const docs = await this.model.find().sort({ createdAt: -1 }).exec();
    return docs.map(doc => ProductMapper.toDomain(doc));
  }

  async update(product: ProductEntity): Promise<ProductEntity | null> {
    if (!product.id || !Types.ObjectId.isValid(product.id)) {
      return null;
    }

    const data = ProductMapper.toPersistence(product);

    const updated = await this.model
      .findByIdAndUpdate(product.id, { $set: data }, { new: true })
      .exec();

    return updated ? ProductMapper.toDomain(updated) : null;
  }




  async delete(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) return false;

    const result = await this.model.findByIdAndDelete(id).exec();
    return !!result;
  }



  async getTopRated(limit: number): Promise<ProductEntity[]> {
    const docs = await this.model
      .find()
      .sort({ rating: -1, numberOfReviews: -1 })
      .limit(limit)
      .exec();

    return docs.map(doc => ProductMapper.toDomain(doc));
  }

  async getHighestDiscount(limit: number): Promise<ProductEntity[]> {
    const docs = await this.model
      .find({ discount: { $gt: 0 } })
      .sort({ discount: -1, updatedAt: -1 })
      .limit(limit)
      .exec();

    return docs.map(doc => ProductMapper.toDomain(doc));
  }

  async getFeatured(): Promise<ProductEntity[]> {
    const docs = await this.model
      .find({ isFeatured: true })
      .sort({ updatedAt: -1 })
      .exec();

    return docs.map(doc => ProductMapper.toDomain(doc));
  }

  async getPopular(limit: number): Promise<ProductEntity[]> {
    const docs = await this.model
      .find()
      .sort({ purchases: -1, views: -1, wishlistAdds: -1 })
      .limit(limit)
      .exec();

    return docs.map(doc => ProductMapper.toDomain(doc));
  }

async search(criteria: SearchCriteria): Promise<PaginatedProducts> {
  const filter: FilterQuery<ProductDocument> = {};

  const page = Math.max(Number(criteria.page ?? 1), 1);
  const limit = Math.max(Number(criteria.limit ?? 10), 1);
  const skip = (page - 1) * limit;

  // پشتیبانی از هر دو پارامتر query و q
  const rawQuery =
    typeof criteria.query === 'string'
      ? criteria.query
      : typeof (criteria as any).q === 'string'
      ? (criteria as any).q
      : '';

  const trimmedQuery = rawQuery.trim();
  const hasTextQuery = trimmedQuery.length > 0;



  // 1) Text search
  if (hasTextQuery) {
    filter.$text = { $search: trimmedQuery };
  }

  // 2) Price filters
  if (criteria.minPrice !== undefined || criteria.maxPrice !== undefined) {
    filter.price = {};

    if (criteria.minPrice !== undefined) {
      (filter.price as any).$gte = Number(criteria.minPrice);
    }

    if (criteria.maxPrice !== undefined) {
      (filter.price as any).$lte = Number(criteria.maxPrice);
    }
  }

  // 3) Minimum rating
  if (criteria.minRating !== undefined) {
    filter.rating = { $gte: Number(criteria.minRating) } as any;
  }

  // 4) Categories filter
  if (Array.isArray(criteria.categories) && criteria.categories.length > 0) {
    const categoryIds = criteria.categories
      .map(id => String(id).trim())
      .filter(id => Types.ObjectId.isValid(id))
      .map(id => new Types.ObjectId(id));

    if (categoryIds.length > 0) {
      filter.categoryId = { $in: categoryIds } as any;
    } else {
      filter.categoryId = { $in: [] } as any;
    }
  }

  // 5) Sorting
  let sort: Record<string, 1 | -1 | { $meta: 'textScore' }> = {};

  if (hasTextQuery) {
    sort = {
      score: { $meta: 'textScore' }
    };
  } else {
    switch (criteria.sortBy) {
      case 'price-asc':
        sort = { price: 1 };
        break;

      case 'price-desc':
        sort = { price: -1 };
        break;

      case 'rating':
        sort = { rating: -1, numberOfReviews: -1 };
        break;

      case 'newest':
      default:
        sort = { createdAt: -1 };
        break;
    }
  }



  try {
    const projection = hasTextQuery
      ? { score: { $meta: 'textScore' } }
      : {};

    const docs = await this.model
      .find(filter, projection)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();

    const total = await this.model.countDocuments(filter).exec();



    return {
      items: docs.map(doc => ProductMapper.toDomain(doc)),
      total,
      page,
      limit,
    };
  } catch (error) {
    console.error('❌ DATABASE QUERY ERROR:', error);

    throw error;
  }
}






  async incrementField(
    id: string,
    field: 'views' | 'purchases' | 'wishlistAdds',
  ): Promise<ProductEntity | null> {
    if (!Types.ObjectId.isValid(id)) return null;

    const safeField = field as CounterField;

    const updated = await this.model
      .findByIdAndUpdate(
        id,
        { $inc: { [safeField]: 1 } },
        { new: true },
      )
      .exec();

    return updated ? ProductMapper.toDomain(updated) : null;
  }

  async updateSimilarProducts(
    id: string,
    similarProducts: string[],
  ): Promise<ProductEntity | null> {
    if (!Types.ObjectId.isValid(id)) return null;

    const objectIds = similarProducts
      .filter(item => Types.ObjectId.isValid(item))
      .map(item => new Types.ObjectId(item));

    const updated = await this.model
      .findByIdAndUpdate(
        id,
        { $set: { similarProducts: objectIds } },
        { new: true },
      )
      .exec();

    return updated ? ProductMapper.toDomain(updated) : null;
  }

  async addFeedbackKeywords(
    id: string,
    keywords: string[],
  ): Promise<ProductEntity | null> {
    if (!Types.ObjectId.isValid(id)) return null;

    const normalized = keywords
      .map(k => k.trim())
      .filter(Boolean);

    const updated = await this.model
      .findByIdAndUpdate(
        id,
        {
          $addToSet: {
            userFeedbackKeywords: { $each: normalized },
          },
        },
        { new: true },
      )
      .exec();

    return updated ? ProductMapper.toDomain(updated) : null;
  }

  async updateRatingStats(
    id: string,
    rating: number,
    numberOfReviews: number,
  ): Promise<ProductEntity | null> {
    if (!Types.ObjectId.isValid(id)) return null;

    const updated = await this.model
      .findByIdAndUpdate(
        id,
        { $set: { rating, numberOfReviews } },
        { new: true },
      )
      .exec();

    return updated ? ProductMapper.toDomain(updated) : null;
  }

  private escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

    async getRelated(id: string, limit: number): Promise<ProductEntity[]> {
    if (!Types.ObjectId.isValid(id)) return [];

    const base = await this.model.findById(id).exec();
    if (!base) return [];

    const safeLimit = Math.max(limit ?? 10, 1);

    // توجه: اینجا فرض کردم فیلد دسته‌بندی در persistence اسمش categoryId هست
    // اگر در اسکیمای تو "category" یا چیز دیگری است، همینجا اصلاحش کن.
    const categoryId = (base as any).categoryId;

    const filter: FilterQuery<ProductDocument> = {
      _id: { $ne: new Types.ObjectId(id) },
    };

    if (categoryId && Types.ObjectId.isValid(String(categoryId))) {
      (filter as any).categoryId = new Types.ObjectId(String(categoryId));
    } else {
      // اگر دسته‌بندی معتبر نبود، حداقل چیزی برنگردونیم که بی‌ربط نشه
      // (می‌تونی این خط رو حذف کنی تا fallback به newest داشته باشی)
      return [];
    }

    const docs = await this.model
      .find(filter)
      .sort({ rating: -1, purchases: -1, updatedAt: -1 })
      .limit(safeLimit)
      .exec();

    return docs.map((doc) => ProductMapper.toDomain(doc));
  }
}
