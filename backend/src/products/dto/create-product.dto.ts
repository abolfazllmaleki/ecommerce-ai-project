export class CreateProductDto {
  readonly name: string;
  readonly description?: string;
  readonly category: string;
  readonly tags?: string[];
  readonly price: number;
  readonly stock?: number;
  readonly brand?: string;
  readonly images?: string[];
  readonly discount?: number;
  readonly similarProducts?: string[];
  readonly featureWeights?: Record<string, number>;
  readonly sizes?: string[];
  readonly colors?: string[];
}
