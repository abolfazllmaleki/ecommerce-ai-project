import { Inject, Injectable } from '@nestjs/common';
import { ICategoryRepository } from '../../domain/category.repository.port';

@Injectable()
export class DeleteCategoryUseCase {
  constructor(
    @Inject('ICategoryRepository') private readonly repo: ICategoryRepository,
  ) {}

  async execute(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
