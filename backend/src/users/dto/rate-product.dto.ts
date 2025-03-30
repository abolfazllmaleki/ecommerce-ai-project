import { IsMongoId, IsNumber, Min, Max } from 'class-validator';

export class RateProductDto {
  @IsMongoId()
  productId: string; // Product being rated

  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number; // Rating value between 0-5
}
