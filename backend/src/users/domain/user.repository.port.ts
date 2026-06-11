import { User } from './user.entity';

export interface PaginatedUsers {
  items: User[];
  total: number;
  page: number;
  limit: number;
}

export interface ProductRatingAggregate {
  averageRating: number;
  count: number;
}

export interface UserProductRatingResult {
  rating: number;
  hasRated: boolean;
}

export interface IUserRepository {
  create(user: User): Promise<User>;
  findById(
    id: string,
    options?: { populateWishlist?: boolean; populateRecommendations?: boolean },
  ): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAllPaginated(page: number, limit: number): Promise<PaginatedUsers>;
  update(user: User): Promise<User | null>;
  delete(id: string): Promise<boolean>;

  addToWishlist(userId: string, productId: string): Promise<User>;
  removeFromWishlist(userId: string, productId: string): Promise<User>;
  getWishlistProductIds(userId: string): Promise<string[]>;

  addInteraction(
    userId: string,
    productId: string,
    interactionType: string,
  ): Promise<User>;

  saveUserRatings(user: User): Promise<User>;
  getProductRatingAggregate(productId: string): Promise<ProductRatingAggregate>;

  updatePassword(userId: string, hashedPassword: string): Promise<User>;
  createPasswordResetToken(email: string): Promise<string | null>;
  resetPassword(token: string, hashedPassword: string): Promise<boolean>;
  findByResetToken(token: string): Promise<User | null>;

  generateRecommendations(userId: string, limit: number): Promise<string[]>;
  addPreferredCategory(userId: string, category: string): Promise<User>;
  removePreferredCategory(userId: string, category: string): Promise<User>;
  getUsersByEngagement(minScore: number): Promise<User[]>;
  getInteractionHistory(userId: string): Promise<Record<string, unknown>[]>;
  getUserProductRating(
    userId: string,
    productId: string,
  ): Promise<UserProductRatingResult>;
}
