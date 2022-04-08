import {BaseStockEntity} from "../bases";
import {BaseUpdateDto} from "@minhdu-fontend/base-dto";
import {ProductEntity} from "../../product/entities";

export interface BaseUpdateStockDto extends Omit<BaseStockEntity, 'id'> {
  readonly branchId: number;
  readonly consignmentId: number;
  readonly products: ProductEntity[],
  readonly attachment: string
}

export type UpdateStockDto = BaseUpdateDto<BaseUpdateStockDto>
