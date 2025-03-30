// src/categories/categories.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './schemas/category.schema';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
  ) {}

  async create(categoryData: Partial<Category>): Promise<Category> {
    const createdCategory = new this.categoryModel(categoryData);
    return createdCategory.save();
  }

  async findAll(): Promise<Category[]> {
    return this.categoryModel.find().exec();
  }

  async findById(id: string): Promise<Category | null> {
    return this.categoryModel.findById(id).exec();
  }

  //   async update(id: string, categoryData: Partial<Category>): Promise<Category> {
  //     return this.categoryModel
  //       .findByIdAndUpdate(id, categoryData, { new: true })
  //       .exec();
  //   }

  async delete(id: string): Promise<void> {
    await this.categoryModel.findByIdAndDelete(id).exec();
  }
}
