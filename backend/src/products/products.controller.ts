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
    @Query('q') query?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('minRating') minRating?: string,
    @Query('categories') categories?: string,
    @Query('sortBy') sortBy?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    try {
      let categoryIds: Types.ObjectId[] = [];

      // Parse and validate categories
      if (categories && categories.trim()) {
        try {
          categoryIds = categories.split(',').map((id) => new Types.ObjectId(id.trim()));
        } catch (e) {
          throw new BadRequestException('Invalid category ID format');
        }
      }

      // Parse and validate numeric parameters
      const parsedMinPrice = minPrice ? Number(minPrice) : undefined;
      const parsedMaxPrice = maxPrice ? Number(maxPrice) : undefined;
      const parsedMinRating = minRating ? Number(minRating) : undefined;
      const parsedPage = page ? Number(page) : 1;
      const parsedLimit = limit ? Number(limit) : 20;

      // Validate numeric values
      if (parsedMinPrice !== undefined && isNaN(parsedMinPrice)) {
        throw new BadRequestException('Invalid minPrice value');
      }
      if (parsedMaxPrice !== undefined && isNaN(parsedMaxPrice)) {
        throw new BadRequestException('Invalid maxPrice value');
      }
      if (parsedMinRating !== undefined && isNaN(parsedMinRating)) {
        throw new BadRequestException('Invalid minRating value');
      }
      if (parsedPage < 1) {
        throw new BadRequestException('Page must be greater than 0');
      }
      if (parsedLimit < 1 || parsedLimit > 100) {
        throw new BadRequestException('Limit must be between 1 and 100');
      }

      console.log('Search request:', {
        query,
        minPrice: parsedMinPrice,
        maxPrice: parsedMaxPrice,
        minRating: parsedMinRating,
        categories: categoryIds,
        sortBy,
        page: parsedPage,
        limit: parsedLimit
      });

      const results = await this.productsService.searchProducts({
        query,
        minPrice: parsedMinPrice,
        maxPrice: parsedMaxPrice,
        minRating: parsedMinRating,
        categories: categoryIds,
        sortBy,
        page: parsedPage,
        limit: parsedLimit
      });

      return {
        products: results,
        pagination: {
          page: parsedPage,
          limit: parsedLimit,
          total: results.length,
          hasMore: results.length === parsedLimit
        }
      };
    } catch (error) {
      console.error('Search controller error:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Search failed: ' + error.message);
    }
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
