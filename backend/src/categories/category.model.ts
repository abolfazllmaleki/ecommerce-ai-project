// src/categories/category.model.ts
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategorySchema } from './schemas/category.schema';

@Injectable()
export class CategoryModel {
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
  ) {}

  // مثال: متد برای ایجاد یک دسته‌بندی جدید
  async create(categoryData: Partial<Category>): Promise<Category> {
    const createdCategory = new this.categoryModel(categoryData);
    return createdCategory.save();
  }

  // مثال: متد برای دریافت تمام دسته‌بندی‌ها
  async findAll(): Promise<Category[]> {
    return this.categoryModel.find().exec();
  }
}
