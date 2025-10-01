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
import { HttpException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserRole } from 'src/users/schemas/user.schema';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}


//   @UseGuards(JwtAuthGuard, RolesGuard)
// @Roles(UserRole.ADMIN)
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
  @Query('categories') categories?: string, // ممکنه اسم یا ID باشه
  @Query('sortBy') sortBy?: string,
  @Query('page') page?: string,
  @Query('limit') limit?: string,
) {
  try {
    // 🚀 دسته‌بندی‌ها رو به آرایه string تبدیل می‌کنیم (اسم یا ID)
    let categoryFilters: string[] = [];
    if (categories && categories.trim()) {
      categoryFilters = categories.split(',').map((c) => c.trim());
    }

    const parsedMinPrice = minPrice ? Number(minPrice) : undefined;
    const parsedMaxPrice = maxPrice ? Number(maxPrice) : undefined;
    const parsedMinRating = minRating ? Number(minRating) : undefined;
    const parsedPage = page ? Number(page) : 1;
    const parsedLimit = limit ? Number(limit) : 20;

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
      categories: categoryFilters,
      sortBy,
      page: parsedPage,
      limit: parsedLimit
    });

    // 📦 پاس دادن مستقیم اسم‌ها یا IDها به سرویس
    const results = await this.productsService.searchProducts({
      query,
      minPrice: parsedMinPrice,
      maxPrice: parsedMaxPrice,
      minRating: parsedMinRating,
      categories: categoryFilters, // سرویس خودش تبدیل می‌کند
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


//     @UseGuards(JwtAuthGuard, RolesGuard)
// @Roles(UserRole.ADMIN)
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


//       @UseGuards(JwtAuthGuard, RolesGuard)
// @Roles(UserRole.ADMIN)
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

  @Get(':id/related')
  async getRelatedProducts(
    @Param('id') id: string,
    @Query('limit') limit: number = 10,
  ): Promise<Product[]> {
    try {
      console.log(id)
      return await this.productsService.findRelatedProducts(id, limit);
    } catch (error) {
      throw new HttpException(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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
