export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
}

export interface UserRating {
  productId: string;
  rating: number;
}

export interface InteractionRecord {
  productId: string;
  interactionType: string;
  timestamp: Date;
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
  ratings?: UserRating[];
  isEmailVerified?: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  interactionHistory?: InteractionRecord[];
  preferredCategories?: string[];
  engagementScore?: number;
}

export class User {
  public readonly id: string | null;
  public name: string;
  public lastname?: string;
  public email: string;
  public password: string;
  public role: UserRole;
  public readonly createdAt: Date;
  public lastLoggedIn: Date;
  public recommendations: string[];
  public wishList: string[];
  public ratings: UserRating[];
  public isEmailVerified: boolean;
  public verificationToken?: string;
  public resetPasswordToken?: string;
  public resetPasswordExpires?: Date;
  public interactionHistory: InteractionRecord[];
  public preferredCategories: string[];
  public engagementScore: number;
  public updatedAt?: Date;

  constructor(props: UserProps) {
    if (!props.name?.trim()) {
      throw new Error('نام کاربر الزامی است.');
    }
    if (!props.email?.trim()) {
      throw new Error('ایمیل الزامی است.');
    }
    if (!props.password) {
      throw new Error('رمز عبور الزامی است.');
    }

    this.id = props.id ?? null;
    this.name = props.name;
    this.lastname = props.lastname;
    this.email = props.email;
    this.password = props.password;
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

  updateProfile(params: {
    name?: string;
    lastname?: string;
    email?: string;
    role?: UserRole;
    isEmailVerified?: boolean;
  }): void {
    if (params.name !== undefined) this.name = params.name;
    if (params.lastname !== undefined) this.lastname = params.lastname;
    if (params.email !== undefined) this.email = params.email;
    if (params.role !== undefined) this.role = params.role;
    if (params.isEmailVerified !== undefined) {
      this.isEmailVerified = params.isEmailVerified;
    }
  }

  setPassword(hashedPassword: string): void {
    this.password = hashedPassword;
  }

  setPasswordReset(token: string, expires: Date): void {
    this.resetPasswordToken = token;
    this.resetPasswordExpires = expires;
  }

  clearPasswordReset(): void {
    this.resetPasswordToken = undefined;
    this.resetPasswordExpires = undefined;
  }

  rateProduct(productId: string, rating: number): boolean {
    if (rating < 0 || rating > 5) {
      throw new Error('امتیاز باید بین ۰ تا ۵ باشد.');
    }

    const existing = this.ratings.find(r => r.productId === productId);
    if (existing) {
      existing.rating = rating;
      return false;
    }

    this.ratings.push({ productId, rating });
    return true;
  }

  toPlainObject(): Record<string, unknown> {
    return {
      _id: this.id,
      id: this.id,
      name: this.name,
      lastname: this.lastname,
      email: this.email,
      password: this.password,
      role: this.role,
      createdAt: this.createdAt,
      lastLoggedIn: this.lastLoggedIn,
      recommendations: this.recommendations,
      wishList: this.wishList,
      ratings: this.ratings.map(r => ({
        product: r.productId,
        rating: r.rating,
      })),
      isEmailVerified: this.isEmailVerified,
      verificationToken: this.verificationToken,
      resetPasswordToken: this.resetPasswordToken,
      resetPasswordExpires: this.resetPasswordExpires,
      interactionHistory: this.interactionHistory,
      preferredCategories: this.preferredCategories,
      engagementScore: this.engagementScore,
    };
  }

  static fromPersistence(data: any): User {
    return new User({
      id: data?._id?.toString?.() ?? data?.id ?? null,
      name: data.name,
      lastname: data.lastname,
      email: data.email,
      password: data.password,
      role: data.role,
      createdAt: data.createdAt,
      lastLoggedIn: data.lastLoggedIn,
      recommendations: (data.recommendations ?? []).map((id: any) =>
        id?.toString?.() ?? id,
      ),
      wishList: (data.wishList ?? []).map((id: any) =>
        id?.toString?.() ?? id,
      ),
      ratings: (data.ratings ?? []).map((r: any) => ({
        productId: r.product?.toString?.() ?? r.productId?.toString?.() ?? r.product,
        rating: r.rating,
      })),
      isEmailVerified: data.isEmailVerified,
      verificationToken: data.verificationToken,
      resetPasswordToken: data.resetPasswordToken,
      resetPasswordExpires: data.resetPasswordExpires,
      interactionHistory: (data.interactionHistory ?? []).map((i: any) => ({
        productId: i.product?.toString?.() ?? i.productId?.toString?.() ?? i.product,
        interactionType: i.interactionType,
        timestamp: i.timestamp,
      })),
      preferredCategories: data.preferredCategories ?? [],
      engagementScore: data.engagementScore ?? 0,
    });
  }
}
