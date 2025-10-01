import { IsNotEmpty, IsString, IsMongoId, MaxLength, MinLength, IsOptional } from 'class-validator';
export class CreateCommentDto {
  @IsMongoId()
  @IsNotEmpty()
  productId: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(1000)
  content: string;

  @IsMongoId()
  @IsOptional()
  parentCommentId?: string;
}