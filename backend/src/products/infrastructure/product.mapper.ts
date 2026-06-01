import { Product } from '../domain/product.entity';
import { ProductDocument } from '../schemas/product.schema';

export class ProductMapper {
  static toDomain(doc: ProductDocument | any): Product {
    return Product.fromPersistence(doc);
  }

  static toPersistence(product: Product): Record<string, any> {
    return {
      name: product.name,
      description: product.description,
      categoryId: product.categoryId,
      tags: product.tags,
      price: product.price,
      stock: product.stock,
      brand: product.brand,
      images: product.images,
      colors: product.colors,
      sizes: product.sizes,
      rating: product.rating,
      numberOfReviews: product.numberOfReviews,
      views: product.views,
      purchases: product.purchases,
      wishlistAdds: product.wishlistAdds,
      discount: product.discount,
      isFeatured: product.isFeatured,
      similarProducts: product.similarProducts,
      userFeedbackKeywords: product.userFeedbackKeywords,
      updatedAt: product.updatedAt,
    };
  }

  static toPersistenceOnCreate(product: Product): Record<string, any> {
    return {
      ...this.toPersistence(product),
      createdAt: product.createdAt,
    };
  }
}
