import {BaseProductEntity} from '../bases';
import {StockEntity} from "../../stock/entities";
import {CategoryEntity} from "../../category/entities";
import {ProviderEntity} from "../../provider/entities";
import {Branch} from "@minhdu-fontend/data-models";

export interface ProductEntity extends BaseProductEntity {
  readonly stocks: StockEntity[];
  readonly category: CategoryEntity
  readonly supplier: ProviderEntity,
  readonly branches?: Branch[],
}
