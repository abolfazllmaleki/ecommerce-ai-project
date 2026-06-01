import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProductsController } from './products.controller';
import { ProductSchema } from './infrastructure/product.schema';
import { ProductRepository } from './infrastructure/product.repository.mongo';

// UseCases
import { CreateProductUseCase } from './application/use-cases/create-product.usecase';
import { FindAllProductsUseCase } from './application/use-cases/find-all-products.usecase';
import { FindProductByIdUseCase } from './application/use-cases/find-product-by-id.usecase';
import { UpdateProductUseCase } from './application/use-cases/update-product.usecase';
import { DeleteProductUseCase } from './application/use-cases/delete-product.usecase';
import { GetTopRatedProductsUseCase } from './application/use-cases/get-top-rated-products.usecase';
import { GetHighestDiscountProductsUseCase } from './application/use-cases/get-highest-discount-products.usecase';
import { GetFeaturedProductsUseCase } from './application/use-cases/get-featured-products.usecase';
import { GetPopularProductsUseCase } from './application/use-cases/get-popular-products.usecase';
import { SearchProductsUseCase } from './application/use-cases/search-products.usecase';
import { IncrementProductFieldUseCase } from './application/use-cases/increment-product-field.usecase';
import { UpdateSimilarProductsUseCase } from './application/use-cases/update-similar-products.usecase';
import { AddFeedbackKeywordsUseCase } from './application/use-cases/add-feedback-keywords.usecase';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
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
  ],
  exports: ['IProductRepository'],
})
export class ProductsModule {}
