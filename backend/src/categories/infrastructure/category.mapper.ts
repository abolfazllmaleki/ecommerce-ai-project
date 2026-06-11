import { Types } from 'mongoose';
import { Category } from '../domain/category.entity';

export class CategoryMapper {
  static toDomain(doc: any): Category {
    return Category.fromPersistence(doc);
  }

  static toPersistence(category: Category): Record<string, unknown> {
    return {
      name: category.name,
      description: category.description,
      image: category.image,
      parentCategory: category.parentCategory
        ? new Types.ObjectId(category.parentCategory)
        : null,
      isActive: category.isActive,
      updatedAt: category.updatedAt,
    };
  }

  static toPersistenceOnCreate(category: Category): Record<string, unknown> {
    return {
      ...this.toPersistence(category),
      createdAt: category.createdAt,
    };
  }
}
