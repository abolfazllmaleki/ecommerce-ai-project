import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseEnumPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { SearchProductsDto } from '../dto/search-products.dto';
import { UpdateSimilarProductsDto } from '../dto/update-similar-products.dto';
import { AddFeedbackKeywordsDto } from '../dto/add-feedback-keywords.dto';
import { ProductsLimitQueryDto } from '../dto/ProductsLimit-Query.dto';

// UseCases
import { CreateProductUseCase } from '../application/use-cases/create-product.use-case';
import { FindAllProductsUseCase } from '../application/use-cases/find-all-products.usecase';
import { FindProductByIdUseCase } from '../application/use-cases/find-product-by-id.usecase';
import { UpdateProductUseCase } from '../application/use-cases/update-product.usecase';
import { DeleteProductUseCase } from '../application/use-cases/delete-product.usecase';
import { GetTopRatedProductsUseCase } from '../application/use-cases/get-top-rated-products.usecase';
import { GetHighestDiscountProductsUseCase } from '../application/use-cases/get-highest-discount-products.usecase';
import { GetFeaturedProductsUseCase } from '../application/use-cases/get-featured-products.usecase';
import { GetPopularProductsUseCase } from '../application/use-cases/get-popular-products.usecase';
import { SearchProductsUseCase } from '../application/use-cases/search-products.use-case';
import { IncrementProductFieldUseCase } from '../application/use-cases/increment-product-field.usecase';
import { UpdateSimilarProductsUseCase } from '../application/use-cases/update-similar-products.usecase';
import { AddFeedbackKeywordsUseCase } from '../application/use-cases/add-feedback-keywords.usecase';
import { GetRelatedProductsUseCase } from '../application/use-cases/get-related-products.usecase';

export enum IncrementableProductField {
  Views = 'views',
  Purchases = 'purchases',
  WishlistAdds = 'wishlistAdds',
}

@Controller('products')
export class ProductsController {
  constructor(
    private readonly createProduct: CreateProductUseCase,
    private readonly findAllProducts: FindAllProductsUseCase,
    private readonly findProductById: FindProductByIdUseCase,
    private readonly updateProduct: UpdateProductUseCase,
    private readonly deleteProduct: DeleteProductUseCase,
    private readonly getTopRated: GetTopRatedProductsUseCase,
    private readonly getHighestDiscount: GetHighestDiscountProductsUseCase,
    private readonly getFeatured: GetFeaturedProductsUseCase,
    private readonly getPopular: GetPopularProductsUseCase,
    private readonly searchProducts: SearchProductsUseCase,
    private readonly incrementField: IncrementProductFieldUseCase,
    private readonly updateSimilar: UpdateSimilarProductsUseCase,
    private readonly addKeywords: AddFeedbackKeywordsUseCase,
    private readonly getRelatedProducts: GetRelatedProductsUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateProductDto) {
    return this.createProduct.execute(dto);
  }

  @Get()
  findAll() {
    return this.findAllProducts.execute();
  }

  @Get('top-rated')
  topRated(@Query() query: ProductsLimitQueryDto) {
    return this.getTopRated.execute(query.limit ?? 6);
  }

  @Get('highest-discount')
  highestDiscount(@Query() query: ProductsLimitQueryDto) {
    return this.getHighestDiscount.execute(query.limit ?? 6);
  }

  @Get('featured')
  featured() {
    return this.getFeatured.execute();
  }

  @Get('popular')
  popular(@Query() query: ProductsLimitQueryDto) {
    return this.getPopular.execute(query.limit ?? 10);
  }

  @Get('search')
  search(@Query() dto: SearchProductsDto) {
    return this.searchProducts.execute(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.findProductById.execute(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.updateProduct.execute(id, dto);
  }

  // برای سازگاری با نسخه قدیم
  @Put(':id')
  replace(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.updateProduct.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.deleteProduct.execute(id);
  }

  @Patch(':id/increment/:field')
  increment(
    @Param('id') id: string,
    @Param('field', new ParseEnumPipe(IncrementableProductField))
    field: IncrementableProductField,
  ) {
    return this.incrementField.execute(id, field);
  }

  @Get(':id/related')
  related(
    @Param('id') id: string,
    @Query() query: ProductsLimitQueryDto,
  ) {
    return this.getRelatedProducts.execute(id, query.limit ?? 10);
  }

  @Post(':id/similar-products')
  updateSimilarProducts(
    @Param('id') id: string,
    @Body() dto: UpdateSimilarProductsDto,
  ) {
    return this.updateSimilar.execute(id, dto.similarProducts);
  }

  @Post(':id/feedback-keywords')
  addFeedbackKeywords(
    @Param('id') id: string,
    @Body() dto: AddFeedbackKeywordsDto,
  ) {
    return this.addKeywords.execute(id, dto.keywords);
  }
}
