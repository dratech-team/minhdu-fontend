import { AddStockDto } from './add-stock.dto';

export interface SearchStockDto extends Partial<AddStockDto> {
  readonly skip: number,
  readonly take: number,
};
