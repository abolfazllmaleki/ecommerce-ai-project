export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
}

export interface UserProps {
  id?: string | null;
  name: string;
  lastname?: string;
  email: string;
  password: string;
  role?: UserRole;
  createdAt?: Date;
  lastLoggedIn?: Date;
  recommendations?: string[];
  wishList?: string[];
  ratings?: { productId: string; rating: number }[];
  isEmailVerified?: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  interactionHistory?: {
    productId: string;
    interactionType: string;
    timestamp: Date;
  }[];
  preferredCategories?: string[];
  engagementScore?: number;
}


export class User {
  public readonly id: string | null;
  public name: string;
  public lastname?: string;
  public email: string;
  private _password: string;
  public role: UserRole;
  public readonly createdAt: Date;
  public lastLoggedIn: Date;
  public recommendations: string[];
  public wishList: string[];
  public ratings: { productId: string; rating: number }[];
  public isEmailVerified: boolean;
  public verificationToken?: string;
  public resetPasswordToken?: string;
  public resetPasswordExpires?: Date;
  public interactionHistory: {
    productId: string;
    interactionType: string;
    timestamp: Date;
  }[];
  public preferredCategories: string[];
  public engagementScore: number;

  constructor(props: UserProps) {
    if (!props.name?.trim()) throw new Error('Name is required');
    if (!props.email?.trim()) throw new Error('Email is required');
    if (!props.password) throw new Error('Password hash is required');

    this.id = props.id ?? null;
    this.name = props.name;
    this.lastname = props.lastname;
    this.email = props.email.toLowerCase();
    this._password = props.password;
    this.role = props.role ?? UserRole.USER;
    this.createdAt = props.createdAt ?? new Date();
    this.lastLoggedIn = props.lastLoggedIn ?? new Date();
    this.recommendations = props.recommendations ?? [];
    this.wishList = props.wishList ?? [];
    this.ratings = props.ratings ?? [];
    this.isEmailVerified = props.isEmailVerified ?? false;
    this.verificationToken = props.verificationToken;
    this.resetPasswordToken = props.resetPasswordToken;
    this.resetPasswordExpires = props.resetPasswordExpires;
    this.interactionHistory = props.interactionHistory ?? [];
    this.preferredCategories = props.preferredCategories ?? [];
    this.engagementScore = props.engagementScore ?? 0;
  }

  // ✅ getter
  get password(): string {
    return this._password;
  }

  // ✅ Auth behavior
  setPassword(hashedPassword: string): void {
    if (!hashedPassword) throw new Error('Password cannot be empty');
    this._password = hashedPassword;
  }

  setPasswordReset(token: string, expires: Date): void {
    this.resetPasswordToken = token;
    this.resetPasswordExpires = expires;
  }

  clearPasswordReset(): void {
    this.resetPasswordToken = undefined;
    this.resetPasswordExpires = undefined;
  }

  recordLogin(): void {
    this.lastLoggedIn = new Date();
  }

  verifyEmail(): void {
    this.isEmailVerified = true;
    this.verificationToken = undefined;
  }

  changeRole(role: UserRole): void {
    this.role = role;
  }

  // ✅ Business behavior
  rateProduct(productId: string, rating: number): boolean {
    if (rating < 0 || rating > 5)
      throw new Error('Rating must be between 0 and 5');

    const existing = this.ratings.find(r => r.productId === productId);

    if (existing) {
      existing.rating = rating;
      return false;
    }

    this.ratings.push({ productId, rating });
    return true;
  }

  addToWishlist(productId: string): void {
    if (!this.wishList.includes(productId)) {
      this.wishList.push(productId);
    }
  }

  removeFromWishlist(productId: string): void {
    this.wishList = this.wishList.filter(id => id !== productId);
  }
  // ✅ DB → Domain
static fromPersistence(doc: any): User {
  return new User({
    id: doc._id?.toString(),
    name: doc.name,
    lastname: doc.lastname,
    email: doc.email,
    password: doc.password,
    role: doc.role,
    createdAt: doc.createdAt,
    lastLoggedIn: doc.lastLoggedIn,
    recommendations: doc.recommendations?.map((id: any) => id.toString()) ?? [],
    wishList: doc.wishList?.map((id: any) => id.toString()) ?? [],
    ratings:
      doc.ratings?.map((r: any) => ({
        productId: r.product.toString(),
        rating: r.rating,
      })) ?? [],
    isEmailVerified: doc.isEmailVerified,
    verificationToken: doc.verificationToken,
    resetPasswordToken: doc.resetPasswordToken,
    resetPasswordExpires: doc.resetPasswordExpires,
    interactionHistory:
      doc.interactionHistory?.map((i: any) => ({
        productId: i.product.toString(),
        interactionType: i.interactionType,
        timestamp: i.timestamp,
      })) ?? [],
    preferredCategories: doc.preferredCategories ?? [],
    engagementScore: doc.engagementScore ?? 0,
  });
}
// ✅ Domain → API
toPlainObject() {
  return {
    id: this.id,
    name: this.name,
    lastname: this.lastname,
    email: this.email,
    role: this.role,
    createdAt: this.createdAt,
    lastLoggedIn: this.lastLoggedIn,
    recommendations: this.recommendations,
    wishList: this.wishList,
    ratings: this.ratings,
    isEmailVerified: this.isEmailVerified,
    preferredCategories: this.preferredCategories,
    engagementScore: this.engagementScore,
  };
}

}
