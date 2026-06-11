import { Inject, Injectable } from '@nestjs/common';
import { ICategoryRepository } from '../../domain/category.repository.port';
import { Category } from '../../domain/category.entity';

@Injectable()
export class FindCategoryByIdUseCase {
  constructor(
    @Inject('ICategoryRepository') private readonly repo: ICategoryRepository,
  ) {}

  async execute(id: string): Promise<Category | null> {
    return this.repo.findById(id);
  }
}
