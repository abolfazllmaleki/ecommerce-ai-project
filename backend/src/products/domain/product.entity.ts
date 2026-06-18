export interface ProductProps {
  id?: string | null;
  name: string;
  description?: string;
  categoryId: string;
  tags?: string[];
  price: number;
  stock: number;
  brand?: string;
  images?: string[];
  colors?: string[];
  sizes?: string[];
  rating?: number;
  numberOfReviews?: number;
  views?: number;
  purchases?: number;
  wishlistAdds?: number;
  discount?: number;
  isFeatured?: boolean;
  similarProducts?: string[];
  userFeedbackKeywords?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export class Product {
  public readonly id: string | null;
  public name: string;
  public description?: string;
  public categoryId: string;
  public tags: string[];
  public price: number;
  public stock: number;
  public brand?: string;
  public images: string[];
  public colors: string[];
  public sizes: string[];
  public rating: number;
  public numberOfReviews: number;
  public views: number;
  public purchases: number;
  public wishlistAdds: number;
  public discount: number;
  public isFeatured: boolean;
  public similarProducts: string[];
  public userFeedbackKeywords: string[];
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(props: ProductProps) {
    if (!props.name || props.name.trim().length < 3) {
      throw new Error('نام محصول باید حداقل ۳ کاراکتر باشد.');
    }

    if (!props.categoryId || props.categoryId.trim().length === 0) {
      throw new Error('دسته‌بندی محصول الزامی است.');
    }

    if (props.price < 0) {
      throw new Error('قیمت محصول نمی‌تواند منفی باشد.');
    }

    if (props.stock < 0) {
      throw new Error('موجودی محصول نمی‌تواند منفی باشد.');
    }

    if ((props.discount ?? 0) < 0 || (props.discount ?? 0) > 100) {
      throw new Error('درصد تخفیف باید بین ۰ تا ۱۰۰ باشد.');
    }

    if ((props.rating ?? 0) < 0 || (props.rating ?? 0) > 5) {
      throw new Error('امتیاز محصول باید بین ۰ تا ۵ باشد.');
    }

    if ((props.numberOfReviews ?? 0) < 0) {
      throw new Error('تعداد نظرات نمی‌تواند منفی باشد.');
    }

    this.id = props.id ?? null;
    this.name = props.name;
    this.description = props.description;
    this.categoryId = props.categoryId;
    this.tags = props.tags ?? [];
    this.price = props.price;
    this.stock = props.stock;
    this.brand = props.brand;
    this.images = props.images ?? [];
    this.colors = props.colors ?? [];
    this.sizes = props.sizes ?? [];
    this.rating = props.rating ?? 0;
    this.numberOfReviews = props.numberOfReviews ?? 0;
    this.views = props.views ?? 0;
    this.purchases = props.purchases ?? 0;
    this.wishlistAdds = props.wishlistAdds ?? 0;
    this.discount = props.discount ?? 0;
    this.isFeatured = props.isFeatured ?? false;
    this.similarProducts = props.similarProducts ?? [];
    this.userFeedbackKeywords = props.userFeedbackKeywords ?? [];
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  updateBasicInfo(params: {
    name?: string;
    description?: string;
    brand?: string;
    categoryId?: string;
    tags?: string[];
    images?: string[];
    colors?: string[];
    sizes?: string[];
  }): void {
    if (params.name !== undefined) {
      if (!params.name || params.name.trim().length < 3) {
        throw new Error('نام محصول باید حداقل ۳ کاراکتر باشد.');
      }
      this.name = params.name;
    }

    if (params.categoryId !== undefined) {
      if (!params.categoryId.trim()) {
        throw new Error('دسته‌بندی محصول الزامی است.');
      }
      this.categoryId = params.categoryId;
    }

    if (params.description !== undefined) this.description = params.description;
    if (params.brand !== undefined) this.brand = params.brand;
    if (params.tags !== undefined) this.tags = [...params.tags];
    if (params.images !== undefined) this.images = [...params.images];
    if (params.colors !== undefined) this.colors = [...params.colors];
    if (params.sizes !== undefined) this.sizes = [...params.sizes];

    this.touch();
  }

  updatePrice(newPrice: number): void {
    if (newPrice < 0) {
      throw new Error('قیمت جدید نمی‌تواند منفی باشد.');
    }
    this.price = newPrice;
    this.touch();
  }

  updateStock(newStock: number): void {
    if (newStock < 0) {
      throw new Error('موجودی جدید نمی‌تواند منفی باشد.');
    }
    this.stock = newStock;
    this.touch();
  }

  increaseStock(quantity: number): void {
    if (quantity <= 0) {
      throw new Error('مقدار افزایش موجودی باید بیشتر از صفر باشد.');
    }
    this.stock += quantity;
    this.touch();
  }

  decreaseStock(quantity: number): void {
    if (quantity <= 0) {
      throw new Error('مقدار کاهش موجودی باید بیشتر از صفر باشد.');
    }
    if (this.stock - quantity < 0) {
      throw new Error('موجودی کافی نیست.');
    }
    this.stock -= quantity;
    this.touch();
  }

  addReview(newRating: number): void {
    if (newRating < 1 || newRating > 5) {
      throw new Error('امتیاز باید بین ۱ تا ۵ باشد.');
    }

    const totalScore = this.rating * this.numberOfReviews;
    this.numberOfReviews += 1;
    this.rating = Number(
      ((totalScore + newRating) / this.numberOfReviews).toFixed(2),
    );

    this.touch();
  }

  incrementViews(): void {
    this.views += 1;
    this.touch();
  }

  incrementPurchases(): void {
    this.purchases += 1;
    this.touch();
  }

  addToWishlist(): void {
    this.wishlistAdds += 1;
    this.touch();
  }

  applyDiscount(discountPercentage: number): void {
    if (discountPercentage < 0 || discountPercentage > 100) {
      throw new Error('درصد تخفیف باید بین ۰ تا ۱۰۰ باشد.');
    }
    this.discount = discountPercentage;
    this.touch();
  }

  removeDiscount(): void {
    this.discount = 0;
    this.touch();
  }

  markAsFeatured(): void {
    this.isFeatured = true;
    this.touch();
  }

  unmarkAsFeatured(): void {
    this.isFeatured = false;
    this.touch();
  }

  setSimilarProducts(productIds: string[]): void {
    this.similarProducts = [...new Set(productIds)];
    this.touch();
  }

  addFeedbackKeywords(keywords: string[]): void {
    const normalized = keywords
      .map(k => k.trim())
      .filter(Boolean);

    this.userFeedbackKeywords = [
      ...new Set([...this.userFeedbackKeywords, ...normalized]),
    ];

    this.touch();
  }

  getFinalPrice(): number {
    if (this.discount <= 0) return this.price;
    return Number((this.price * (1 - this.discount / 100)).toFixed(2));
  }

  private touch(): void {
    this.updatedAt = new Date();
  }

  toPlainObject(): Record<string, any> {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      categoryId: this.categoryId,
      tags: this.tags,
      price: this.price,
      stock: this.stock,
      brand: this.brand,
      images: this.images,
      colors: this.colors,
      sizes: this.sizes,
      rating: this.rating,
      numberOfReviews: this.numberOfReviews,
      views: this.views,
      purchases: this.purchases,
      wishlistAdds: this.wishlistAdds,
      discount: this.discount,
      isFeatured: this.isFeatured,
      similarProducts: this.similarProducts,
      userFeedbackKeywords: this.userFeedbackKeywords,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      finalPrice: this.getFinalPrice(),
    };
  }

  static fromPersistence(data: any): Product {
    return new Product({
      id: data?._id?.toString?.() ?? data?.id ?? null,
      name: data.name,
      description: data.description,
      categoryId: data.categoryId?.toString?.() ?? data.categoryId,
      tags: data.tags,
      price: data.price,
      stock: data.stock,
      brand: data.brand,
      images: data.images,
      colors: data.colors,
      sizes: data.sizes,
      rating: data.rating,
      numberOfReviews: data.numberOfReviews,
      views: data.views,
      purchases: data.purchases,
      wishlistAdds: data.wishlistAdds,
      discount: data.discount,
      isFeatured: data.isFeatured,
      similarProducts: (data.similarProducts ?? []).map((id: any) =>
        id?.toString?.() ?? id,
      ),
      userFeedbackKeywords: data.userFeedbackKeywords,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
  static rehydrate(data: any): Product {
  return new Product({
    id: data.id ?? null,
    name: data.name,
    description: data.description,
    categoryId: data.categoryId,
    tags: data.tags ?? [],
    price: data.price,
    stock: data.stock,
    brand: data.brand,
    images: data.images ?? [],
    colors: data.colors ?? [],
    sizes: data.sizes ?? [],
    rating: data.rating ?? 0,
    numberOfReviews: data.numberOfReviews ?? 0,
    views: data.views ?? 0,
    purchases: data.purchases ?? 0,
    wishlistAdds: data.wishlistAdds ?? 0,
    discount: data.discount ?? 0,
    isFeatured: data.isFeatured ?? false,
    similarProducts: data.similarProducts ?? [],
    userFeedbackKeywords: data.userFeedbackKeywords ?? [],
    createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
    updatedAt: data.updatedAt ? new Date(data.updatedAt) : undefined,
  });
}
}
