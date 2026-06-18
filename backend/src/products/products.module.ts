import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProductsController } from './interface/products.controller';
import { ProductSchema } from './schemas/product.schema';
import { ProductRepository } from './infrastructure/product.repository';

// UseCases
import { CreateProductUseCase } from './application/use-cases/create-product.use-case';
import { GetRelatedProductsUseCase } from './application/use-cases/get-related-products.usecase';
import { FindAllProductsUseCase } from './application/use-cases/find-all-products.usecase';
import { FindProductByIdUseCase } from './application/use-cases/find-product-by-id.usecase';
import { UpdateProductUseCase } from './application/use-cases/update-product.usecase';
import { DeleteProductUseCase } from './application/use-cases/delete-product.usecase';
import { GetTopRatedProductsUseCase } from './application/use-cases/get-top-rated-products.usecase';
import { GetHighestDiscountProductsUseCase } from './application/use-cases/get-highest-discount-products.usecase';
import { GetFeaturedProductsUseCase } from './application/use-cases/get-featured-products.usecase';
import { GetPopularProductsUseCase } from './application/use-cases/get-popular-products.usecase';
import { SearchProductsUseCase } from './application/use-cases/search-products.use-case';
import { IncrementProductFieldUseCase } from './application/use-cases/increment-product-field.usecase';
import { UpdateSimilarProductsUseCase } from './application/use-cases/update-similar-products.usecase';
import { AddFeedbackKeywordsUseCase } from './application/use-cases/add-feedback-keywords.usecase';
import { RedisModule } from '../shared/infrastructure/redis/redis.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),RedisModule
    
    
  
  ],
  controllers: [ProductsController],
  providers: [
    // bind interface -> implementation
    { provide: 'IProductRepository', useClass: ProductRepository },
    // use cases
    CreateProductUseCase,
    FindAllProductsUseCase,
    FindProductByIdUseCase,
    UpdateProductUseCase,
    DeleteProductUseCase,
    GetTopRatedProductsUseCase,
    GetHighestDiscountProductsUseCase,
    GetFeaturedProductsUseCase,
    GetPopularProductsUseCase,
    SearchProductsUseCase,
    IncrementProductFieldUseCase,
    UpdateSimilarProductsUseCase,
    AddFeedbackKeywordsUseCase,
    GetRelatedProductsUseCase,
  ],
  exports: ['IProductRepository', IncrementProductFieldUseCase],
})
export class ProductsModule {}
