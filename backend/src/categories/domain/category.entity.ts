export interface CategoryProps {
  id?: string | null;
  name: string;
  description?: string;
  image?: string;
  parentCategory?: string | null;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Category {
  public readonly id: string | null;
  public name: string;
  public description: string;
  public image: string;
  public parentCategory: string | null;
  public isActive: boolean;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(props: CategoryProps) {
    if (!props.name?.trim()) {
      throw new Error('نام دسته‌بندی الزامی است.');
    }

    this.id = props.id ?? null;
    this.name = props.name.trim();
    this.description = props.description ?? '';
    this.image = props.image ?? '';
    this.parentCategory = props.parentCategory ?? null;
    this.isActive = props.isActive ?? true;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  toPlainObject(): Record<string, unknown> {
    return {
      _id: this.id,
      id: this.id,
      name: this.name,
      description: this.description,
      image: this.image,
      parentCategory: this.parentCategory,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  static fromPersistence(data: any): Category {
    return new Category({
      id: data?._id?.toString?.() ?? data?.id ?? null,
      name: data.name,
      description: data.description,
      image: data.image,
      parentCategory:
        data.parentCategory?.toString?.() ?? data.parentCategory ?? null,
      isActive: data.isActive,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
}
