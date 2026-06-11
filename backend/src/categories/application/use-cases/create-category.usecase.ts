import { Inject, Injectable } from '@nestjs/common';
import { ICategoryRepository } from '../../domain/category.repository.port';
import { Category } from '../../domain/category.entity';
import { CreateCategoryDto } from '../../dto/create-category.dto';

@Injectable()
export class CreateCategoryUseCase {
  constructor(
    @Inject('ICategoryRepository') private readonly repo: ICategoryRepository,
  ) {}

  async execute(dto: CreateCategoryDto): Promise<Category> {
    const category = new Category({
      name: dto.name,
      description: dto.description,
      image: dto.image,
      parentCategory: dto.parentCategory ?? null,
      isActive: dto.isActive,
    });
    return this.repo.create(category);
  }
}
