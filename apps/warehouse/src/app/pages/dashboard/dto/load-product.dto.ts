import { CreateProductDto } from './create-product.dto';

export interface LoadProductDto extends Partial<CreateProductDto> {
  readonly skip: number,
  readonly take: number,
};
