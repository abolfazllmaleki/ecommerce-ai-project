import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as crypto from 'crypto';
import {
  IUserRepository,
  PaginatedAdminUsers,
  PaginatedUsers,
  ProductRatingAggregate,
  UpdateUserData,
  UserProductRatingResult,
} from '../domain/user.repository.port';
import { User } from '../domain/user.entity';
import { UserDocument } from '../schemas/user.schema';
import { UserMapper } from './user.mapper';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectModel('User')
    private readonly model: Model<UserDocument>,
  ) {}

  async create(user: User): Promise<User> {
    const data = UserMapper.toPersistenceOnCreate(user);
    const created = new this.model(data);
    const saved = await created.save();
    return UserMapper.toDomain(saved);
  }

async findById(
  id: string,
  options?: {
    populateWishlist?: boolean;
    populateRecommendations?: boolean;
  },
): Promise<User | null> {
  if (!Types.ObjectId.isValid(id)) {
    return null;
  }

  let query = this.model.findById(id);

  query = query.populate('wishList');

  if (options?.populateRecommendations) {
    query = query.populate('recommendations');
  }

  const doc = await query.exec();

  return doc ? UserMapper.toDomain(doc) : null;
}

  async findByEmail(email: string): Promise<User | null> {
    const doc = await this.model.findOne({ email }).populate('wishList').exec();
    return doc ? UserMapper.toDomain(doc) : null;
  }

async findAllPaginated(
  page: number,
  limit: number,
): Promise<PaginatedUsers> {
  const skip = (page - 1) * limit;

  const [docs, total] = await Promise.all([
    this.model
      .find()
      .populate('wishList')
      .skip(skip)
      .limit(limit)
      .exec(),

    this.model.countDocuments().exec(),
  ]);

  return {
    items: docs.map((doc) => UserMapper.toDomain(doc)),
    total,
    page,
    limit,
  };
}
async findAdminUsers(
  page: number,
  limit: number,
): Promise<PaginatedAdminUsers> {
  const skip = (page - 1) * limit;

  const [docs, total] = await Promise.all([
    this.model
      .find()
      .select(
        '_id name lastname email role isEmailVerified createdAt lastLoggedIn engagementScore',
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec(),

    this.model.countDocuments().exec(),
  ]);

  return {
    items: docs.map((doc) =>
      UserMapper.toAdminListItem(doc),
    ),
    total,
    page,
    limit,
  };
}

async findAdminUserById(
  id: string,
): Promise<User | null> {
  if (!Types.ObjectId.isValid(id)) {
    return null;
  }

  const doc = await this.model
    .findById(id)
    .populate('wishList')
    .populate('recommendations')
    .exec();

  return doc
    ? UserMapper.toDomain(doc)
    : null;
}

async updateAdmin(
  userId: string,
  data: UpdateUserData,
): Promise<User | null> {
  if (!Types.ObjectId.isValid(userId)) {
    return null;
  }

  const updated = await this.model
    .findByIdAndUpdate(
      userId,
      { $set: data },
      { new: true },
    )
    .exec();

  if (!updated) {
    return null;
  }

  return UserMapper.toDomainForAdmin(updated);
}

  async update(user: User): Promise<User | null> {
    if (!user.id || !Types.ObjectId.isValid(user.id)) return null;

    const data = UserMapper.toPersistence(user);
    const updated = await this.model
      .findByIdAndUpdate(user.id, { $set: data }, { new: true })
      .exec();

    return updated ? UserMapper.toDomain(updated) : null;
  }

  async delete(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) return false;
    const result = await this.model.findByIdAndDelete(id).exec();
    return !!result;
  }

  async addToWishlist(userId: string, productId: string): Promise<User> {
    const doc = await this.model
      .findByIdAndUpdate(
        userId,
        { $addToSet: { wishList: new Types.ObjectId(productId) } },
        { new: true },
      )
      .populate('wishList')
      .exec();




    if (!doc) throw new Error('USER_NOT_FOUND');
    return UserMapper.toDomain(doc);
  }

  async removeFromWishlist(userId: string, productId: string): Promise<User> {
    const doc = await this.model
      .findByIdAndUpdate(
        userId,
        { $pull: { wishList: new Types.ObjectId(productId) } },
        { new: true },
      )
      .exec();

    if (!doc) throw new Error('USER_NOT_FOUND');
    return UserMapper.toDomain(doc);
  }

  async getWishlistProductIds(userId: string): Promise<string[]> {
    const doc = await this.model.findById(userId).populate('wishList').exec();
    if (!doc) throw new Error('USER_NOT_FOUND');

    return (doc.wishList ?? []).map((item: any) =>
      item?._id?.toString?.() ?? item?.toString?.() ?? item,
    );
  }

  async addInteraction(
    userId: string,
    productId: string,
    interactionType: string,
  ): Promise<User> {
    const doc = await this.model
      .findByIdAndUpdate(
        userId,
        {
          $push: {
            interactionHistory: {
              product: new Types.ObjectId(productId),
              interactionType,
              timestamp: new Date(),
            },
          },
        },
        { new: true },
      )
      .exec();

    if (!doc) throw new Error('USER_NOT_FOUND');
    return UserMapper.toDomain(doc);
  }

  async saveUserRatings(user: User): Promise<User> {
    if (!user.id) throw new Error('USER_ID_REQUIRED');

    const doc = await this.model
      .findByIdAndUpdate(
        user.id,
        {
          $set: {
            ratings: user.ratings.map(r => ({
              product: new Types.ObjectId(r.productId),
              rating: r.rating,
            })),
          },
        },
        { new: true },
      )
      .exec();

    if (!doc) throw new Error('USER_NOT_FOUND');
    return UserMapper.toDomain(doc);
  }

  async getProductRatingAggregate(
    productId: string,
  ): Promise<ProductRatingAggregate> {
    if (!Types.ObjectId.isValid(productId)) {
      return { averageRating: 0, count: 0 };
    }

    const productObjectId = new Types.ObjectId(productId);
    const allRatings = await this.model.aggregate([
      { $match: { 'ratings.product': productObjectId } },
      { $unwind: '$ratings' },
      { $match: { 'ratings.product': productObjectId } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$ratings.rating' },
          count: { $sum: 1 },
        },
      },
    ]);

    if (!allRatings.length) {
      return { averageRating: 0, count: 0 };
    }

    return {
      averageRating: allRatings[0].averageRating,
      count: allRatings[0].count,
    };
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<User> {
    const doc = await this.model
      .findByIdAndUpdate(userId, { password: hashedPassword }, { new: true })
      .exec();

    if (!doc) throw new Error('USER_NOT_FOUND');
    return UserMapper.toDomain(doc);
  }

  async createPasswordResetToken(email: string): Promise<string | null> {
    const doc = await this.model.findOne({ email }).exec();
    if (!doc) return null;

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000);

    doc.resetPasswordToken = resetToken;
    doc.resetPasswordExpires = resetTokenExpiry;
    await doc.save();

    return resetToken;
  }

  async resetPassword(token: string, hashedPassword: string): Promise<boolean> {
    const doc = await this.model.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!doc) throw new Error('INVALID_RESET_TOKEN');

    doc.password = hashedPassword;
    doc.resetPasswordToken = undefined;
    doc.resetPasswordExpires = undefined;
    await doc.save();

    return true;
  }

  async findByResetToken(token: string): Promise<User | null> {
    const doc = await this.model
      .findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: new Date() },
      })
      .exec();

    return doc ? UserMapper.toDomain(doc) : null;
  }

  async generateRecommendations(userId: string, limit: number): Promise<string[]> {
    const results = await this.model
      .aggregate([
        { $match: { _id: new Types.ObjectId(userId) } },
        { $unwind: '$interactionHistory' },
        { $group: { _id: '$interactionHistory.product', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: limit },
        { $project: { _id: 1 } },
      ])
      .exec();

    return results.map(item => item._id.toString());
  }

  async addPreferredCategory(userId: string, category: string): Promise<User> {
    const doc = await this.model
      .findByIdAndUpdate(
        userId,
        { $addToSet: { preferredCategories: category } },
        { new: true },
      )
      .exec();

    if (!doc) throw new Error('USER_NOT_FOUND');
    return UserMapper.toDomain(doc);
  }

  async removePreferredCategory(userId: string, category: string): Promise<User> {
    const doc = await this.model
      .findByIdAndUpdate(
        userId,
        { $pull: { preferredCategories: category } },
        { new: true },
      )
      .exec();

    if (!doc) throw new Error('USER_NOT_FOUND');
    return UserMapper.toDomain(doc);
  }

  async getUsersByEngagement(minScore: number): Promise<User[]> {
    const docs = await this.model
      .find({ engagementScore: { $gte: minScore } })
      .exec();
    return docs.map(doc => UserMapper.toDomain(doc));
  }

  async getInteractionHistory(userId: string): Promise<Record<string, unknown>[]> {
    return this.model
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
            category: '$productDetails.categoryId',
          },
        },
      ])
      .exec();
  }

  async getUserProductRating(
    userId: string,
    productId: string,
  ): Promise<UserProductRatingResult> {
    const user = await this.findById(userId);
    if (!user) throw new Error('USER_NOT_FOUND');

    const rating = user.ratings.find(r => r.productId === productId);
    return {
      rating: rating ? rating.rating : 0,
      hasRated: !!rating,
    };
  }
}
