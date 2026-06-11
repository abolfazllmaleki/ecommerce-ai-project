import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ICategoryRepository } from '../domain/category.repository.port';
import { Category as CategoryEntity } from '../domain/category.entity';
import { Category } from '../schemas/category.schema';
import { CategoryMapper } from './category.mapper';

@Injectable()
export class CategoryRepository implements ICategoryRepository {
  constructor(
    @InjectModel('Category')
    private readonly model: Model<Category>,
  ) {}

  async create(category: CategoryEntity): Promise<CategoryEntity> {
    const data = CategoryMapper.toPersistenceOnCreate(category);
    const created = new this.model(data);
    const saved = await created.save();
    return CategoryMapper.toDomain(saved);
  }

  async findAll(): Promise<CategoryEntity[]> {
    const docs = await this.model.find().exec();
    return docs.map(doc => CategoryMapper.toDomain(doc));
  }

  async findById(id: string): Promise<CategoryEntity | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const doc = await this.model.findById(id).exec();
    return doc ? CategoryMapper.toDomain(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) return false;
    const result = await this.model.findByIdAndDelete(id).exec();
    return !!result;
  }
}
