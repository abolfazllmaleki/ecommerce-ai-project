import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategorySchema } from './schemas/category.schema';
import { CategoriesController } from './interface/categories.controller';
import { CategoryRepository } from './infrastructure/category.repository';
import { CreateCategoryUseCase } from './application/use-cases/create-category.usecase';
import { FindAllCategoriesUseCase } from './application/use-cases/find-all-categories.usecase';
import { FindCategoryByIdUseCase } from './application/use-cases/find-category-by-id.usecase';
import { DeleteCategoryUseCase } from './application/use-cases/delete-category.usecase';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Category', schema: CategorySchema }]),
  ],
  controllers: [CategoriesController],
  providers: [
    { provide: 'ICategoryRepository', useClass: CategoryRepository },
    CreateCategoryUseCase,
    FindAllCategoriesUseCase,
    FindCategoryByIdUseCase,
    DeleteCategoryUseCase,
  ],
  exports: ['ICategoryRepository'],
})
export class CategoriesModule {}
