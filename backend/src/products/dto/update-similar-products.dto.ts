import { IsArray, IsString } from 'class-validator';

export class UpdateSimilarProductsDto {
  @IsArray()
  @IsString({ each: true })
  similarProducts: string[];
}
