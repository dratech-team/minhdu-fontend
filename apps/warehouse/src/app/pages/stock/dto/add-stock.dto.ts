import {BaseStockEntity} from "../bases";
import {BaseAddDto} from "@minhdu-fontend/base-dto";
import {AttachmentEntity} from "../entities";

interface BaseAddStockDto extends BaseStockEntity {
  readonly branchId: number;
  readonly consignment?: number;
  readonly productId: number
  readonly file?: string
}

export type AddStockDto = BaseAddDto<BaseAddStockDto>
