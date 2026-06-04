import { Inject, Injectable } from '@nestjs/common';
import { ICategoryRepository } from '../../domain/category.repository.port';
import { Category } from '../../domain/category.entity';

@Injectable()
export class FindAllCategoriesUseCase {
  constructor(
    @Inject('ICategoryRepository') private readonly repo: ICategoryRepository,
  ) {}

  async execute(): Promise<Category[]> {
    return this.repo.findAll();
  }
}
