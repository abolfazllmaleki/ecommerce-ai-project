// users.service.ts
import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AddInteractionDto } from './dto/add-interaction.dto';
import { RateProductDto } from './dto/rate-product.dto';
import { Product } from 'src/products/schemas/product.schema';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Product') private productModel: Model<Product>,
    private readonly ProductsService: ProductsService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const newUser = new this.userModel(createUserDto);
      console.log('service created', newUser);
      return await newUser.save();
    } catch (error) {
      throw new InternalServerErrorException('Error creating user');
    }
  }
  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findAllPaginated(
    page: number,
    limit: number,
  ): Promise<{ data: User[]; total: number }> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.userModel.find().skip(skip).limit(limit).exec(),
      this.userModel.countDocuments().exec(),
    ]);
    return { data, total };
  }

  async findOne(id: string): Promise<User | null> {
    return this.userModel
      .findById(id)
      .populate('wishList')
      .populate('recommendations')
      .exec();
  }
  async addToWishlist(userId: string, productId: string): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(
        userId,
        { $addToSet: { wishList: new Types.ObjectId(productId) } },
        { new: true },
      )
      .populate('wishList', '_id') // اضافه کردن populate
      .exec();

    if (!user) throw new NotFoundException('User not found');

    await this.ProductsService.incrementField(productId, 'wishlistAdds');
    return user;
  }
  async getWishlist(userId: string): Promise<Product[]> {
    const user = await this.userModel
      .findById(userId)
      .populate('wishList')
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.wishList as Product[];
  }

  async removeFromWishlist(userId: string, productId: string): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(
        userId,
        {
          $pull: { wishList: new Types.ObjectId(productId) },
        },
        { new: true },
      )
      .exec();

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<User | null> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async addInteraction(
    userId: string,
    addInteractionDto: AddInteractionDto,
  ): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        userId,
        {
          $push: {
            interactionHistory: {
              product: new Types.ObjectId(addInteractionDto.productId),
              interactionType: addInteractionDto.interactionType,
              timestamp: new Date(),
            },
          },
        },
        { new: true },
      )
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser;
  }

  async rateProduct(
    userId: string,
    rateProductDto: RateProductDto,
  ): Promise<User> {
    const { productId, rating } = rateProductDto;
    console.log('rating services');
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // تبدیل productId به ObjectId
    const productObjectId = new Types.ObjectId(productId);

    // Check if user already rated this product
    const existingRating = user.ratings.find(
      (r) => r.product.toString() === productObjectId.toString(),
    );

    if (existingRating) {
      // Update existing rating
      existingRating.rating = rating;
    } else {
      // Add new rating
      user.ratings.push({ product: productObjectId, rating });
    }

    await user.save();

    // ✅ Recalculate product's average rating
    const allRatings = await this.userModel.aggregate([
      { $match: { 'ratings.product': product._id } },
      { $unwind: '$ratings' },
      { $match: { 'ratings.product': product._id } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$ratings.rating' },
        },
      },
    ]);

    product.rating = allRatings.length ? allRatings[0].averageRating : 0;
    await product.save();

    return user;
  }

  async generateRecommendations(
    userId: string,
    limit: number,
  ): Promise<string[]> {
    const results = await this.userModel
      .aggregate([
        { $match: { _id: new Types.ObjectId(userId) } },
        { $unwind: '$interactionHistory' },
        { $group: { _id: '$interactionHistory.product', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: limit },
        { $project: { _id: 1 } },
      ])
      .exec();

    return results.map((item) => item._id.toString());
  }

  // async calculateEngagementScore(userId: string): Promise<number> {
  //   const user = await this.userModel.findById(userId).exec();
  //   if (!user) throw new NotFoundException('User not found');

  //   const interactionCount = user.interactionHistory.length;
  //   const orderCount = user.purchaseHistory.length;
  //   const wishlistCount = user.wishList.length;
  //   return interactionCount * 0.5 + orderCount * 2 + wishlistCount * 0.3;
  // }

  async addPreferredCategory(userId: string, category: string): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        userId,
        { $addToSet: { preferredCategories: category } },
        { new: true },
      )
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser;
  }

  async removePreferredCategory(
    userId: string,
    category: string,
  ): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        userId,
        { $pull: { preferredCategories: category } },
        { new: true },
      )
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser;
  }

  // Additional AI-related methods
  async getUsersByEngagement(minScore: number): Promise<User[]> {
    return this.userModel.find({ engagementScore: { $gte: minScore } }).exec();
  }

  async getInteractionHistory(userId: string): Promise<any[]> {
    return this.userModel
      .aggregate([
        { $match: { _id: new Types.ObjectId(userId) } },
        { $unwind: '$interactionHistory' },
        {
          $lookup: {
            from: 'products',
            localField: 'interactionHistory.product',
            foreignField: '_id',
            as: 'productDetails',
          },
        },
        { $unwind: '$productDetails' },
        {
          $project: {
            _id: 0,
            type: '$interactionHistory.interactionType',
            timestamp: 1,
            productName: '$productDetails.name',
            category: '$productDetails.category',
          },
        },
      ])
      .exec();
  }
}
