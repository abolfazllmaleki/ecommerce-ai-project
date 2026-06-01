import { IsArray, IsString } from 'class-validator';

export class AddFeedbackKeywordsDto {
  @IsArray()
  @IsString({ each: true })
  keywords: string[];
}
