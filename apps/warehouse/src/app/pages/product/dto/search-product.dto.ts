import { AddProductDto } from './add-product.dto';

export interface SearchProductDto extends Partial<AddProductDto> {
  readonly skip: number,
  readonly take: number,
};
