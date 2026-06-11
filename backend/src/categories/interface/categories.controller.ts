import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
} from '@nestjs/common';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { CreateCategoryUseCase } from '../application/use-cases/create-category.usecase';
import { FindAllCategoriesUseCase } from '../application/use-cases/find-all-categories.usecase';
import { FindCategoryByIdUseCase } from '../application/use-cases/find-category-by-id.usecase';
import { DeleteCategoryUseCase } from '../application/use-cases/delete-category.usecase';

@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly createCategory: CreateCategoryUseCase,
    private readonly findAllCategories: FindAllCategoriesUseCase,
    private readonly findCategoryById: FindCategoryByIdUseCase,
    private readonly deleteCategory: DeleteCategoryUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateCategoryDto) {
    const category = await this.createCategory.execute(dto);
    return category.toPlainObject();
  }

  @Get()
  async findAll() {
    const categories = await this.findAllCategories.execute();
    return categories.map(c => c.toPlainObject());
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const category = await this.findCategoryById.execute(id);
    return category ? category.toPlainObject() : null;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.deleteCategory.execute(id);
  }
}
