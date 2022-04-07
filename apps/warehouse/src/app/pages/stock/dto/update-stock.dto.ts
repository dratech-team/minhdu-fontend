import {BaseStockEntity} from "../bases";
import {BaseUpdateDto} from "@minhdu-fontend/base-dto";

interface BaseUpdateStockDto extends BaseStockEntity {
  readonly branchId: number;
  readonly consignment: number;
  readonly productId: number
  readonly file: string
}

export type UpdateStockDto = BaseUpdateDto<BaseUpdateStockDto>
