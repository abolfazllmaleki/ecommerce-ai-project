// src/categories/categories.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './schemas/category.schema';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async create(@Body() categoryData: Partial<Category>): Promise<Category> {
    return this.categoriesService.create(categoryData);
  }

  @Get()
  async findAll(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Category | null> {
    return this.categoriesService.findById(id);
  }

  //   @Put(':id')
  //   async update(
  //     @Param('id') id: string,
  //     @Body() categoryData: Partial<Category>,
  //   ): Promise<Category> {
  //     return this.categoriesService.update(id, categoryData);
  //   }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.categoriesService.delete(id);
  }
}
