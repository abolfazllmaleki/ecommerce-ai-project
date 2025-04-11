import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Patch,
  NotFoundException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './schemas/product.schema';
import { BadRequestException } from '@nestjs/common';
import { Query } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import { Types } from 'mongoose';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() product: Product): Promise<Product> {
    console.log(product);
    return this.productsService.create(product);
  }

  @Get()
  async findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }
  @Get('top-rated')
  async getTopRatedProducts(
    @Query('limit') limit?: number,
  ): Promise<Product[]> {
    return this.productsService.getTopRatedProducts(limit);
  }
  @Get('highest-discount')
  async getHighestDiscountProducts(
    @Query('limit') limit?: number,
  ): Promise<Product[]> {
    return this.productsService.getHighestDiscountProducts(limit);
  }
  @Get('search')
  async search(
    @Query('q') query: string,
    @Query('minPrice') minPrice: number,
    @Query('maxPrice') maxPrice: number,
    @Query('minRating') minRating: number,
    @Query('categories') categories: string,
    @Query('sortBy') sortBy: string,
  ) {
    let categoryIds: Types.ObjectId[] = [];

    if (categories) {
      try {
        categoryIds = categories.split(',').map((id) => new Types.ObjectId(id));
      } catch (e) {
        throw new BadRequestException('Invalid category ID format');
      }
    }

    return this.productsService.searchProducts({
      query,
      minPrice: Number(minPrice),
      maxPrice: Number(maxPrice),
      minRating: Number(minRating),
      categories: categoryIds, // ارسال ObjectId[]
      sortBy,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product> {
    const product = await this.productsService.findOne(id);
    if (!product) {
      throw new NotFoundException('محصول مورد نظر یافت نشد');
    }
    return product;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() product: Product,
  ): Promise<Product> {
    const updatedProduct = await this.productsService.update(id, product);
    if (!updatedProduct) {
      throw new NotFoundException('محصول مورد نظر یافت نشد');
    }
    return updatedProduct;
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    const deletedProduct = await this.productsService.delete(id);
    if (!deletedProduct) {
      throw new NotFoundException('محصول مورد نظر یافت نشد');
    }
    return { message: 'محصول با موفقیت حذف شد' };
  }

  @Patch(':id/increment/:field')
  async incrementCounter(
    @Param('id') id: string,
    @Param('field') field: string,
  ): Promise<Product> {
    console.log(id);
    console.log(field);
    console.log('incrementCounter');
    const allowedFields = ['views', 'purchases', 'wishlistAdds'];
    if (!allowedFields.includes(field)) {
      throw new BadRequestException('امکان افزایش این فیلد وجود ندارد');
    }

    const updated = await this.productsService.incrementField(id, field);
    if (!updated) throw new NotFoundException('محصول یافت نشد');
    return updated;
  }

  @Post(':id/similar-products')
  async updateSimilarProducts(
    @Param('id') id: string,
    @Body() { similarProducts }: { similarProducts: string[] },
  ): Promise<Product> {
    const updated = await this.productsService.updateSimilarProducts(
      id,
      similarProducts,
    );
    if (!updated) throw new NotFoundException('محصول یافت نشد');
    return updated;
  }

  @Post(':id/feedback-keywords')
  async addFeedbackKeywords(
    @Param('id') id: string,
    @Body() { keywords }: { keywords: string[] },
  ): Promise<Product> {
    const updated = await this.productsService.addUserFeedbackKeywords(
      id,
      keywords,
    );
    if (!updated) throw new NotFoundException('محصول یافت نشد');
    return updated;
  }

  @Get('featured')
  async getFeaturedProducts(): Promise<Product[]> {
    return this.productsService.getFeaturedProducts();
  }

  @Get('popular')
  async getPopularProducts(@Query('limit') limit?: number): Promise<Product[]> {
    return this.productsService.getPopularProducts(limit);
  }
}
