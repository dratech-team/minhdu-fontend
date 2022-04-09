import {BaseIoiReceiptEntity} from "../bases";
import {BaseUpdateDto} from "@minhdu-fontend/base-dto";
import {ProductEntity} from "../../product/entities";

export interface BaseUpdateIoiReceiptDto extends Omit<BaseIoiReceiptEntity, 'id'> {
  readonly branchId: number;
  readonly consignmentId: number;
  readonly products: ProductEntity[],
  readonly attachment: string
}

export type UpdateIoiReceiptDto = BaseUpdateDto<BaseUpdateIoiReceiptDto>
