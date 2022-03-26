import { CreateProductDto } from './create-product.dto';

export interface SearchProductDto extends Partial<CreateProductDto> {
  readonly skip: number,
  readonly take: number,
};
