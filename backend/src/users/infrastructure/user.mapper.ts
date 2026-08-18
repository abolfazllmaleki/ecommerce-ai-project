import { Types } from 'mongoose';
import { User } from '../domain/user.entity';
import { UserDocument } from '../schemas/user.schema';

export class UserMapper {
  static toDomain(doc: UserDocument | any): User {
    return User.fromPersistence(doc);
  }

  static toAdminListItem(doc: any) {
  return {
    id: doc._id?.toString(),
    name: doc.name,
    lastname: doc.lastname,
    email: doc.email,
    role: doc.role,
    isEmailVerified: doc.isEmailVerified,
    createdAt: doc.createdAt,
    lastLoggedIn: doc.lastLoggedIn,
    engagementScore: doc.engagementScore ?? 0,
  };
}
  static toDomainForAdmin(doc: UserDocument): User {
    return User.fromPersistence({
      ...doc.toObject(),
      wishList: [],
    });
  }
  static toPersistenceForAdmin(user: User) {
  return {
    name: user.name,
    lastname: user.lastname,
    email: user.email,
    role: user.role,
    isEmailVerified: user.isEmailVerified,
  };
}

  static toPersistence(user: User): Record<string, unknown> {

  
    return {
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      password: user.password,
      role: user.role,
      lastLoggedIn: user.lastLoggedIn,
      recommendations: user.recommendations.map(id => new Types.ObjectId(id)),

        wishList: user.wishList.map(product => {
          if (!product.id) {
            throw new Error('Wishlist product must have an id');
          }

          return new Types.ObjectId(product.id);
        }),
    
    ratings: user.ratings.map(r => ({
        product: new Types.ObjectId(r.productId),
        rating: r.rating,
      })),
      isEmailVerified: user.isEmailVerified,
      verificationToken: user.verificationToken,
      resetPasswordToken: user.resetPasswordToken,
      resetPasswordExpires: user.resetPasswordExpires,
      interactionHistory: user.interactionHistory.map(i => ({
        product: new Types.ObjectId(i.productId),
        interactionType: i.interactionType,
        timestamp: i.timestamp,
      })),
      preferredCategories: user.preferredCategories,
      engagementScore: user.engagementScore,
    };
  }

  static toPersistenceOnCreate(user: User): Record<string, unknown> {
    return {
      ...this.toPersistence(user),
      createdAt: user.createdAt,
    };
  }
}
