import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schemas/product.schema';
import * as mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import { Types } from 'mongoose';
import { Category } from '../categories/schemas/category.schema';


@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
    @InjectModel('Category') private readonly categoryModel: Model<Category> 
  ) {}




  async findRelatedProducts(
    productId: string,
    limit: number = 10,
  ): Promise<Product[]> {
    const currentProduct = await this.productModel.findById(productId);
    if (!currentProduct) {
      throw new Error('Product not found');
    }
    console.log('current product',currentProduct.name)
    const relatedProducts = await this.findRelatedByMultipleStrategies(
      currentProduct,
      limit,
    );

    return relatedProducts;
  }

  private async findRelatedByMultipleStrategies(
    product: Product,
    limit: number,
  ): Promise<Product[]> {
    const strategies = [
      this.findByCategoryAndTags.bind(this),
      this.findBySimilarFeatures.bind(this),
      this.findByPopularInCategory.bind(this),
      this.findByUserBehavior.bind(this),
    ];

    const results: Product[] = [];
    
    for (const strategy of strategies) {
      if (results.length >= limit) break;
      
      const strategyResults = await strategy(product, limit - results.length);
      const uniqueResults = strategyResults.filter(
      (p) =>
        (p._id as Types.ObjectId).toString() !== (product._id as Types.ObjectId).toString() &&
        !results.some(r => (r._id as Types.ObjectId).toString() === (p._id as Types.ObjectId).toString())

      );
      
      results.push(...uniqueResults);
    }

    return results.slice(0, limit);
  }



private async findByCategoryAndTags(
  product: Product,
  limit: number,
): Promise<Product[]> {

  const outcome = await this.productModel
    .find({
      categoryId: new Types.ObjectId(product.categoryId), // ensure ObjectId
      _id: { $ne: product._id },
      $or: [
        { tags: { $in: product.tags } },
        { brand: { $regex: new RegExp(`^${product.brand}$`, 'i') } },
      ],
    })
    .sort({ rating: -1, purchases: -1 })
    .limit(limit)
    .exec();

  return outcome;
}


  private async findBySimilarFeatures(
    product: Product,
    limit: number,
  ): Promise<Product[]> {
    const priceRange = product.price * 0.3;  
    
    return this.productModel
      .find({
        categoryId: product.categoryId,
        _id: { $ne: product._id },
        price: {
          $gte: product.price - priceRange,
          $lte: product.price + priceRange,
        },
        $or: [
          { colors: { $in: product.colors } },
          { sizes: { $in: product.sizes } },
        ],
      })
      .sort({ rating: -1, views: -1 })
      .limit(limit)
      .exec();
  }


  private async findByPopularInCategory(
  product: Product,
  limit: number,
): Promise<Product[]> {
  return this.productModel
    .find({
      categoryId: new Types.ObjectId(product.categoryId), // convert to ObjectId
      _id: { $ne: product._id },
      rating: { $gte: 4 },
    })
    .sort({ purchases: -1, views: -1, wishlistAdds: -1 })
    .limit(limit)
    .exec();
}

  private async findByUserBehavior(
    product: Product,
    limit: number,
  ): Promise<Product[]> {
    if (product.similarProducts && product.similarProducts.length > 0) {
      return this.productModel
        .find({
          _id: { 
            $in: product.similarProducts
              .slice(0, 10)
              .map(id => new Types.ObjectId(id)) 
          },
        })
        .limit(limit)
        .exec();
    }

    return [];
  }





async create(productDto: any): Promise<Product> {
  try {
    // Check if categoryId is provided (from frontend) or if we need to convert from category
    if (productDto.category) {
      let categoryId: Types.ObjectId;

      // If category is a valid ObjectId string
      if (typeof productDto.category === 'string' && Types.ObjectId.isValid(productDto.category)) {
        categoryId = new Types.ObjectId(productDto.category);
      }
      // If category is a name string
      else if (typeof productDto.category === 'string') {
        const categoryDoc = await this.categoryModel.findOne({
          name: new RegExp(`^${productDto.category}$`, 'i')
        }).select('_id').exec();

        if (!categoryDoc) {
          throw new Error(`Category not found: ${productDto.category}`);
        }
        
        categoryId = categoryDoc._id as Types.ObjectId;
      } else {
        throw new Error(`Invalid category format: ${typeof productDto.category}`);
      }

      // Set categoryId and remove category field
      productDto.categoryId = categoryId; // This is now an ObjectId
      delete productDto.category;
    }

    // Validate that categoryId exists
    if (!productDto.categoryId) {
      throw new Error('categoryId is required');
    }

    // Ensure categoryId is always stored as ObjectId, not string
    if (typeof productDto.categoryId === 'string') {
      if (!Types.ObjectId.isValid(productDto.categoryId)) {
        throw new Error('Invalid categoryId format');
      }
      productDto.categoryId = new Types.ObjectId(productDto.categoryId);
    }

    console.log('Final categoryId type:', typeof productDto.categoryId);
    console.log('Final categoryId value:', productDto.categoryId);

    const newProduct = new this.productModel(productDto);
    return await newProduct.save();
  } catch (error) {
    console.error('Create product error:', error);
    throw new Error(`Create product error: ${error.message}`);
  }
}

async findAll(): Promise<Product[]> {
  return this.productModel
    .find()
    .populate('categoryId', 'name') 
    .select('-__v') 
    .exec();
}

async findOne(id: string): Promise<Product | null> {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error(`Invalid product ID: ${id}`);
  }
  

  return this.productModel
    .findById(id)
    .populate('categoryId', 'name') 
    .select('-__v')
    .exec();
}

  async getTopRatedProducts(limit: number = 6): Promise<Product[]> {
    return this.productModel
      .find()
      .sort({ rating: -1 }) 
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



async update(id: string, product: Partial<Product>): Promise<Product | null> {
  if (product.categoryId && typeof product.categoryId === 'string') {
    if (!Types.ObjectId.isValid(product.categoryId)) {
      throw new Error('Invalid categoryId format');
    }
    product.categoryId = new Types.ObjectId(product.categoryId) as any;
  }

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


//   async searchProducts(filters: {
//   query?: string;
//   minPrice?: number;
//   maxPrice?: number;
//   minRating?: number;
//   categories?: string[];   
//   sortBy?: string;
//   page: number;
//   limit: number;
// }): Promise<Product[]> {
//   try {
//     const { query, minPrice, maxPrice, minRating, categories, sortBy, page, limit } = filters;

//     const queryConditions: any = {};

//     if (query && query.trim()) {
//       const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
//       queryConditions.$or = [
//     { name: { $regex: escapedQuery, $options: 'i' } },         
//     { description: { $regex: escapedQuery, $options: 'i' } },   
//     { tags: { $in: [new RegExp(escapedQuery, 'i')] } },        
//     { brand: { $regex: escapedQuery, $options: 'i' } }      
//       ];
//     }

//     if (minPrice !== undefined || maxPrice !== undefined) {
//       queryConditions.price = {};
//       if (minPrice !== undefined) queryConditions.price.$gte = minPrice;
//       if (maxPrice !== undefined) queryConditions.price.$lte = maxPrice;
//     }

//     if (minRating && minRating > 0) {
//       queryConditions.rating = { $gte: minRating };
//     }

//     if (categories && categories.length > 0) {
//       const categoryIds: Types.ObjectId[] = [];
//       const namesToSearch: string[] = [];

//       for (const c of categories) {
//         if (Types.ObjectId.isValid(c)) {
//           categoryIds.push(new Types.ObjectId(c));
//         } else {
//           namesToSearch.push(c);
//         }
//       }

//       if (namesToSearch.length > 0) {
//         const categoryDocs = await this.categoryModel.find({
//           name: { $in: namesToSearch.map(name => new RegExp(`^${name}$`, 'i')) }
//         }).select('_id');

//         categoryDocs.forEach(doc => categoryIds.push(doc._id as any));
//       }

//       if (categoryIds.length === 0) {
//         queryConditions._id = { $in: [] }; 
//       } else {
//         queryConditions.categoryId = { $in: categoryIds };
//       }
//     }

//     let sortOptions: any = { createdAt: -1 };
//     if (sortBy) {
//       switch (sortBy) {
//         case 'price-asc': sortOptions = { price: 1 }; break;
//         case 'price-desc': sortOptions = { price: -1 }; break;
//         case 'rating': sortOptions = { rating: -1 }; break;
//         case 'popularity': sortOptions = { views: -1, purchases: -1 }; break;
//         case 'newest': sortOptions = { createdAt: -1 }; break;
//         default: sortOptions = { createdAt: -1 };
//       }
//     }

//     const skip = (page - 1) * limit;

//     if(queryConditions.categoryId){

//       const idsAsString = queryConditions.categoryId.$in.map(id => id.toString());
//         queryConditions.categoryId = { $in: idsAsString }; 
//     }




//     const results = await this.productModel
//       .find(queryConditions)
//       .sort(sortOptions)
//       .skip(skip)
//       .limit(limit)
//       .populate('categoryId', 'name')
//       .select('-__v')
//       .exec();

//     return results;
//   } catch (error) {
//     console.error('Search error:', error);
//     throw new Error(`Search error: ${error.message}`);
//   }
// }
async searchProducts(filters: {
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  categories?: string[];
  sortBy?: string;
  page: number;
  limit: number;
}): Promise<Product[]> {
  try {
    const { query, minPrice, maxPrice, minRating, categories, sortBy, page, limit } = filters;

    const queryConditions: any = {};

    if (query && query.trim()) {
      const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      queryConditions.$or = [
        { name: { $regex: escapedQuery, $options: 'i' } },
        { description: { $regex: escapedQuery, $options: 'i' } },
        { tags: { $in: [new RegExp(escapedQuery, 'i')] } },
        { brand: { $regex: escapedQuery, $options: 'i' } },
      ];
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      queryConditions.price = {};
      if (minPrice !== undefined) queryConditions.price.$gte = minPrice;
      if (maxPrice !== undefined) queryConditions.price.$lte = maxPrice;
    }

    if (minRating && minRating > 0) {
      queryConditions.rating = { $gte: minRating };
    }

    if (categories && categories.length > 0) {
      const categoryIds: Types.ObjectId[] = [];
      const namesToSearch: string[] = [];

      for (const c of categories) {
        if (Types.ObjectId.isValid(c)) {
          categoryIds.push(new Types.ObjectId(c));
        } else {
          namesToSearch.push(c);
        }
      }

      if (namesToSearch.length > 0) {
        const categoryDocs = await this.categoryModel.find({
          name: { $in: namesToSearch.map(name => new RegExp(`^${name}$`, 'i')) }
        }).select('_id');

        categoryDocs.forEach(doc => categoryIds.push(doc._id  as any));
      }

      if (categoryIds.length > 0) {
        queryConditions.categoryId = { $in: categoryIds };
      } else {
        queryConditions.categoryId = { $in: [] }; // هیچ محصولی پیدا نمی‌شود
      }
    }

    let sortOptions: any = { createdAt: -1 };
    if (sortBy) {
      switch (sortBy) {
        case 'price-asc': sortOptions = { price: 1 }; break;
        case 'price-desc': sortOptions = { price: -1 }; break;
        case 'rating': sortOptions = { rating: -1 }; break;
        case 'popularity': sortOptions = { views: -1, purchases: -1 }; break;
        case 'newest': sortOptions = { createdAt: -1 }; break;
        default: sortOptions = { createdAt: -1 };
      }
    }

    const skip = (page - 1) * limit;

    const results = await this.productModel
      .find(queryConditions)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .populate('categoryId', 'name') // ObjectId درست هست
      .select('-__v')
      .exec();

    return results;
  } catch (error) {
    console.error('Search error:', error);
    throw new Error(`Search error: ${error.message}`);
  }
}

}
