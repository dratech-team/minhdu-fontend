import {BaseProductEntity} from '../bases';
import {StockEntity} from "../../stock/entities";
import {WarehouseEntity} from "../../warehouse/entities";
import {SupplierEntity} from "../../supplier/entities";
import {Branch} from "@minhdu-fontend/data-models";

export interface ProductEntity extends BaseProductEntity {
  readonly stocks: StockEntity[];
  readonly category: WarehouseEntity
  readonly supplier: SupplierEntity,
  readonly branches?: Branch[],
}
